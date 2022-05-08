import { acceptHMRUpdate, defineStore } from 'pinia';
import { serializeDot } from '@/helpers/parsers';
import { useGraphStore } from '@/stores/graph.store';
import { useToastStore } from '@/stores/toast.store';
import { Optional } from '@/helpers/types';
import { useModelStore } from '@/stores/model.store';
import { io } from 'socket.io-client';

interface State {
  isOpen: boolean;
  isRunning: boolean;
  iterations: Optional<number>;
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
    iterations: 100,
    step: undefined,
    id: undefined
  }),
  actions: {
    stopSimulation() {
      socket.emit('stop', { id: this.id });
    },
    runSimulation() {
      const modelStore = useModelStore();

      if (!modelStore.model) return;
      this.step = 0;

      const graphStore = useGraphStore();
      const toastStore = useToastStore();

      socket.emit('start', {
        model: modelStore.model,
        iterations: this.iterations,
        dotGraph: serializeDot(graphStore.graph, false)
      });

      this.isRunning = true;

      socket.on('id', (data) => {
        this.id = data.id;
      });

      socket.on('step', (data) => {
        console.log('step', data);
      });

      socket.on('error', (data) => {
        console.log('error', data);
        toastStore.error = {
          summary: 'Error during simulation',
          detail: data.message
        };
      });

      socket.on('exit', (data) => {
        console.log('exit', data);
        socket.off('step');
        socket.off('error');
        socket.off('exit');
        this.isRunning = false;
      });
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSimulationStore, import.meta.hot));
}
