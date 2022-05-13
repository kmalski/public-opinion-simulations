import { acceptHMRUpdate, defineStore } from 'pinia';
import { serializeDot } from '@/helpers/parsers';
import { useGraphStore } from '@/stores/graph.store';
import { useToastStore } from '@/stores/toast.store';
import { Optional } from '@/helpers/types';
import { useModelStore } from '@/stores/model.store';
import { io } from 'socket.io-client';
import { opinionToColor } from '@/helpers/graph';
import { useChartStore } from '@/stores/chart.store';
import { StatisticName } from '@/composables/useChart';

interface State {
  isOpen: boolean;
  isRunning: boolean;
  isPause: boolean;
  step: number;
  targetStep: Optional<number>;
  targetIterations: Optional<number>;
  id: Optional<string>;
}

const url = import.meta.env.VITE_SERVER_URL;
const path = import.meta.env.VITE_SERVER_PATH;

const socket = io(`${url}/simulation`, {
  transports: ['polling', 'websocket'],
  upgrade: true,
  path: (path ? path : '') + '/socket.io'
});

export const useSimulationStore = defineStore('simulation', {
  state: (): State => ({
    isOpen: false,
    isRunning: false,
    isPause: false,
    step: 0,
    targetStep: undefined,
    targetIterations: undefined,
    id: undefined
  }),
  actions: {
    pauseSimulation() {
      socket.emit('stop', { id: this.id });
      socket.off('step');
      this.isPause = true;
    },
    stopSimulation() {
      if (this.isRunning) {
        socket.emit('stop', { id: this.id });
        socket.off('step');
      }
      this.isPause = false;
      this.step = 0;
      this.targetStep = undefined;
      this.targetIterations = undefined;
    },
    runSimulation(iterations: number, mode: 'sync' | 'async') {
      const modelStore = useModelStore();

      if (!modelStore.model) return;

      const graphStore = useGraphStore();
      const toastStore = useToastStore();
      const chartStore = useChartStore();

      if (this.step === 0) chartStore.clearAll();
      if (!this.isPause) {
        this.targetStep = 0;
        this.targetIterations = iterations;
      }

      socket.on('id', (data) => {
        this.id = data.id;
      });

      socket.on('step', (data) => {
        const update = JSON.parse(data);
        this.step += 1;
        // @ts-ignore
        this.targetStep += 1;

        const opinion = update.changes[0].opinion.toString();
        const color = opinionToColor(opinion);
        graphStore.graph.forEachNode((node, attributes) => {
          if (attributes.label !== opinion) {
            attributes.label = opinion;
            attributes.color = color;
          }
        });
        graphStore.renderer?.refresh();

        const stats = update.stats ?? [];
        stats.forEach((stat: { name: StatisticName; value: number }) => {
          chartStore.updateStatistic(stat.name, stat.value, this.step);
        });
      });

      socket.on('exception', (data) => {
        toastStore.error = {
          summary: 'Error during simulation',
          detail: data.message
        };
      });

      socket.on('exit', (data) => {
        if (data.code) {
          toastStore.error = {
            summary: 'Error during simulation',
            detail: `Simulation exited with code: ${data.code}`
          };
        }
        socket.off();
        this.isRunning = false;
        if (!this.isPause) {
          this.targetIterations = undefined;
          this.targetStep = undefined;
        }
      });

      socket.emit('start', {
        model: modelStore.model,
        iterations: this.isPause && iterations > this.step ? iterations - this.step : iterations,
        mode: mode,
        dotGraph: serializeDot(graphStore.graph, false)
      });

      this.isPause = this.isPause && iterations === 1;
      this.isRunning = true;
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSimulationStore, import.meta.hot));
}
