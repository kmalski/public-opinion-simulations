import { acceptHMRUpdate, defineStore } from 'pinia';
import { OpinionModel } from '@/components/menu/simulation/model/OpinionModel.vue';

interface State {
  modelName: string;
  model?: OpinionModel;
}

function initState() {
  return { modelName: '', model: undefined };
}

export const useSimulationStore = defineStore('simulation', {
  state: (): State => initState(),
  actions: {
    setModelName(modelName: string) {
      this.modelName = modelName;
    },
    setModel(model: OpinionModel) {
      this.model = model;
    },
    runSimulation() {
      if (this.model) this.model.runSimulation();
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSimulationStore, import.meta.hot));
}
