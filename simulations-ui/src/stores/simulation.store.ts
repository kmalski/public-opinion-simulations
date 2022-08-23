import { acceptHMRUpdate, defineStore } from 'pinia';
import { parseDot, serializeDot } from '@/helpers/parsers';
import { useGraphStore } from '@/stores/graph.store';
import { useToastStore } from '@/stores/toast.store';
import { BinaryOpinion, Optional } from '@/helpers/types';
import { useModelStore } from '@/stores/model.store';
import { io } from 'socket.io-client';
import { opinionToColor } from '@/helpers/graph';
import { useChartStore } from '@/stores/chart.store';
import { StatisticName } from '@/composables/useChart';
import { range } from '@/helpers/utils';

interface SimulationOptions {
  iterations: number;
  mode: 'sync' | 'async';
  frameDurationSec: number;
}

interface State {
  isOpen: boolean;
  isRunning: boolean;
  isPause: boolean;
  step: number;
  simulationMode: Optional<'animation' | 'forward'>;
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
    simulationMode: undefined,
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
      this.simulationMode = undefined;
      this.targetStep = undefined;
      this.targetIterations = undefined;
    },
    runSimulation(mode: 'animation' | 'forward', options: SimulationOptions) {
      const modelStore = useModelStore();

      if (!modelStore.modelName) return;
      if (!modelStore.validateFunc()) return;

      const graphStore = useGraphStore();
      const toastStore = useToastStore();
      const chartStore = useChartStore();

      if (this.step === 0) chartStore.clearAll();

      if (!this.isPause) {
        this.targetStep = 0;
        this.targetIterations = options.iterations;
      }

      if (mode == 'animation') this.listenStep();
      else this.listenResult();

      socket.on('id', (data) => {
        this.id = data.id;
      });

      socket.on('exception', (data) => {
        toastStore.error = {
          summary: 'Error during simulation',
          detail: data.message
        };
        if (this.id !== undefined) {
          socket.emit('stop', { id: this.id });
        } else {
          this.isRunning = false;
          socket.off();
        }
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
        this.id = undefined;
        if (!this.isPause) {
          this.targetIterations = undefined;
          this.targetStep = undefined;
        }
      });

      const currStep = this.targetStep ?? 0;
      const iterLeft = options.iterations > currStep ? options.iterations - currStep : options.iterations;

      socket.emit('start', {
        model: modelStore.modelName,
        modelParams: modelStore.modelParams,
        iterations: iterLeft,
        mode: options.mode,
        dotGraph: serializeDot(graphStore.graph, false),
        frameDurationSec: options.frameDurationSec
      });

      this.isPause = this.isPause && options.iterations === 1;
      this.isRunning = true;
      this.simulationMode = mode;
    },
    listenStep() {
      const graphStore = useGraphStore();
      const chartStore = useChartStore();

      socket.on('step', (update) => {
        update.changes.forEach((change: { node: string; opinion: number }) => {
          const opinion = update.changes[0].opinion.toString();
          const color = opinionToColor(opinion);
          const node = change.node;

          graphStore.graph.mergeNodeAttributes(node, { color: color, label: opinion });
        });
        graphStore.renderer?.refresh();

        const stats = update.stats ?? [];
        stats.forEach((stat: { name: StatisticName; values: number[] }) => {
          chartStore.updateStatistic(stat.name, stat.values, this.labels(stat.values.length));
        });

        this.step += 1;
        // @ts-ignore
        this.targetStep += 1;
      });
    },
    listenResult() {
      const graphStore = useGraphStore();
      const chartStore = useChartStore();

      socket.on('result', (result) => {
        const resultingGraph = parseDot(result.graph);
        graphStore.graph.forEachNode((node, attributes) => {
          const opinion = resultingGraph.getNodeAttribute(node, 'label') as BinaryOpinion;
          const color = opinionToColor(opinion);
          attributes.label = opinion;
          attributes.color = color;
        });
        graphStore.renderer?.refresh();

        const stats = result.stats ?? [];
        stats.forEach((stat: { name: StatisticName; values: number[] }) => {
          chartStore.updateStatistic(stat.name, stat.values, this.labels(stat.values.length));
        });

        this.step += result.step;
        // @ts-ignore
        this.targetStep += result.step;
      });
    },
    labels(count: number) {
      return range(this.step + 1, this.step + count + 1);
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSimulationStore, import.meta.hot));
}
