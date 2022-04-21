import { acceptHMRUpdate, defineStore } from 'pinia';
import { OpinionModelComponent } from '@/components/menu/simulation/model/OpinionModel.vue';
import { serializeDot } from '@/helpers/parser';
import { ToastSeverity } from 'primevue/api';
import { useGraphStore } from '@/stores/graph.store';
import { useToast } from 'primevue/usetoast';

interface State {
  modelComponentName: string;
  modelComponent?: OpinionModelComponent;
  model: any;
  isRunning: boolean;
  step?: number;
  eventSrc?: EventSource;
}

function initState(): State {
  return {
    modelComponentName: '',
    modelComponent: undefined,
    model: {},
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
    async runSimulation() {
      if (!this.modelComponent) return;
      this.modelComponent.pushModelToStore();

      const graphStore = useGraphStore();
      const url = import.meta.env.VITE_SERVER_URL;

      const response = await fetch(`${url}/simulation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: {},
          dotGraph: serializeDot(graphStore.graph, false)
        })
      });

      if (response.ok) {
        const body = await response.json();
        this.eventSrc = new EventSource(`${url}/simulation/${body.id}/subscribe`);
        this.isRunning = true;

        this.eventSrc.onmessage = ({ data }) => {
          const message = JSON.parse(data);
          if (message.status === 'CLOSED' && this.eventSrc) {
            this.eventSrc.close();
            this.isRunning = false;
          }
          if (message.status === 'OK') {
            console.log(message.step);
            this.step = +message.step;
          }
          if (message.status === 'ERROR') {
            console.log(message.message);
            // toast.add({
            //   severity: ToastSeverity.ERROR,
            //   summary: 'Error during simulation',
            //   detail: message.message,
            //   life: 10000
            // });
          }
        };
      } else {
        this.isRunning = false;
        const error = await response.json();
        console.log(error.message);
        // toast.add({
        //   severity: ToastSeverity.ERROR,
        //   summary: 'Can not run simulation',
        //   detail: error.message,
        //   life: 10000
        // });
      }
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSimulationStore, import.meta.hot));
}
