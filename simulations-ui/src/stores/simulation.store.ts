import { collectLayoutAsFlatArray, assignLayoutAsFlatArray } from 'graphology-layout/utils';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { parseDot, serializeDot } from '@/helpers/parser';
import { useGraphStore } from '@/stores/graph.store';
import { useToastStore } from '@/stores/toast.store';
import { Optional } from '@/helpers/types';

interface State {
  isRunning: boolean;
  modelComponentName: Optional<string>;
  model: Optional<object>;
  iterations: Optional<number>;
  step: Optional<number>;
}

export const useSimulationStore = defineStore('simulation', {
  state: (): State => ({
    isRunning: false,
    modelComponentName: undefined,
    model: undefined,
    iterations: 100,
    step: undefined
  }),
  actions: {
    async runSimulation() {
      if (!this.model) return;
      this.step = 0;

      const graphStore = useGraphStore();
      const toastStore = useToastStore();
      const url = import.meta.env.VITE_SERVER_URL;

      const layout = collectLayoutAsFlatArray(graphStore.graph);

      const response = await fetch(`${url}/simulation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          iterations: this.iterations,
          dotGraph: serializeDot(graphStore.graph, false)
        })
      });

      if (response.ok) {
        const body = await response.json();
        const eventSrc = new EventSource(`${url}/simulation/${body.id}/subscribe`);

        eventSrc.onopen = () => {
          this.isRunning = true;
        };

        eventSrc.onmessage = ({ data }) => {
          const message = JSON.parse(data);
          if (message.status === 'OK') {
            this.step = +message.step;
          }

          if (message.status === 'CLOSED') {
            if (message.resultStatus === 'SUCCESS') {
              const graph = parseDot(message.dotGraph);
              assignLayoutAsFlatArray(graph, layout);
              graphStore.setGraph(graph);
            } else {
              toastStore.error = {
                summary: 'Simulation error',
                detail: 'Could not finish simulation due to unknown error'
              };
            }
            eventSrc.close();
            this.isRunning = false;
          }

          if (message.status === 'ERROR') {
            toastStore.error = {
              summary: 'Error during simulation',
              detail: message.message
            };
          }
        };

        eventSrc.onerror = () => {
          this.isRunning = false;
        };
      } else {
        this.isRunning = false;
        const error = await response.json();
        toastStore.error = {
          summary: 'Can not run simulation',
          detail: error.message
        };
      }
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSimulationStore, import.meta.hot));
}
