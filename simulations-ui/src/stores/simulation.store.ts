import { acceptHMRUpdate, defineStore } from 'pinia';
import { OpinionModelComponent } from '@/components/menu/simulation/model/OpinionModel.vue';
import { parseDot, serializeDot } from '@/helpers/parser';
import { useGraphStore } from '@/stores/graph.store';
import { useToastStore } from '@/stores/toast.store';

interface State {
  modelComponentName: string;
  modelComponent?: OpinionModelComponent;
  model: any;
  iterations?: number;
  isRunning: boolean;
  step?: number;
  eventSrc?: EventSource;
}

function initState(): State {
  return {
    modelComponentName: '',
    modelComponent: undefined,
    model: {},
    iterations: 100,
    isRunning: false,
    step: undefined,
    eventSrc: undefined
  };
}

export const useSimulationStore = defineStore('simulation', {
  state: (): State => initState(),
  actions: {
    setModelComponentName(modelComponentName: string) {
      this.modelComponentName = modelComponentName;
    },
    setModelComponent(modelComponent: OpinionModelComponent) {
      this.modelComponent = modelComponent;
    },
    setModel(model: any) {
      this.model = model;
    },
    setIterations(iterations: number) {
      this.iterations = iterations;
    },
    async runSimulation() {
      if (!this.modelComponent) return;
      this.modelComponent.pushModelToStore();
      this.step = 0;

      const graphStore = useGraphStore();
      const toastStore = useToastStore();
      const url = import.meta.env.VITE_SERVER_URL;

      const response = await fetch(`${url}/simulation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: {},
          dotGraph: serializeDot(graphStore.graph, true)
        })
      });

      if (response.ok) {
        const body = await response.json();
        this.eventSrc = new EventSource(`${url}/simulation/${body.id}/subscribe`);
        // localStorage.setItem('simulationId', body.id);

        this.eventSrc.onopen = () => {
          this.isRunning = true;
        };

        this.eventSrc.onmessage = ({ data }) => {
          const message = JSON.parse(data);
          if (message.status === 'OK') {
            this.step = +message.step;
          }

          if (message.status === 'CLOSED' && this.eventSrc) {
            if (message.resultStatus === 'SUCCESS') {
              graphStore.setGraph(parseDot(message.dotGraph));
            } else {
              toastStore.setError({
                summary: 'Simulation error',
                detail: 'Could not finish simulation due to unknown error'
              });
            }
            // localStorage.removeItem('simulationId');
            this.eventSrc.close();
            this.isRunning = false;
          }

          if (message.status === 'ERROR') {
            toastStore.setError({
              summary: 'Error during simulation',
              detail: message.message
            });
          }
        };

        this.eventSrc.onerror = () => {
          this.isRunning = false;
        };
      } else {
        this.isRunning = false;
        const error = await response.json();
        toastStore.setError({
          summary: 'Can not run simulation',
          detail: error.message
        });
      }
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSimulationStore, import.meta.hot));
}
