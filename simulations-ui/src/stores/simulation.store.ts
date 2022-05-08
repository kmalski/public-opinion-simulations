import { acceptHMRUpdate, defineStore } from 'pinia';
import { serializeDot } from '@/helpers/parsers';
import { useGraphStore } from '@/stores/graph.store';
import { useToastStore } from '@/stores/toast.store';
import { Optional } from '@/helpers/types';
import { useModelStore } from '@/stores/model.store';
import { io } from 'socket.io-client';
import { opinionToColor } from '@/helpers/graph';

interface State {
  isOpen: boolean;
  isRunning: boolean;
  step: Optional<number>;
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
    step: undefined,
    id: undefined
  }),
  actions: {
    stopSimulation() {
      socket.emit('stop', { id: this.id });
    },
    runSimulation(iterations: number, mode: 'sync' | 'async') {
      const modelStore = useModelStore();

      if (!modelStore.model) return;
      this.step = 0;

      const graphStore = useGraphStore();
      const toastStore = useToastStore();

      this.isRunning = true;

      socket.on('id', (data) => {
        this.id = data.id;
      });

      socket.on('step', (data) => {
        const stepChanges = JSON.parse(data);
        this.step = stepChanges.step;
        const opinion = stepChanges.changes[0].opinion.toString();
        const color = opinionToColor(opinion);
        graphStore.graph.forEachNode((node, attributes) => {
          if (attributes.label !== opinion) {
            attributes.label = opinion;
            attributes.color = color;
          }
        });
        graphStore.renderer?.refresh();
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
        socket.removeAllListeners();
        this.isRunning = false;
      });

      socket.emit('start', {
        model: modelStore.model,
        iterations: iterations,
        mode: mode,
        dotGraph: serializeDot(graphStore.graph, false)
      });
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSimulationStore, import.meta.hot));
}
