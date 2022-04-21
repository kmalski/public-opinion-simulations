import { acceptHMRUpdate, defineStore } from 'pinia';
import { GraphGeneratorComponent } from '@/components/menu/graph/generator/GraphGenerator.vue';

interface State {
  generatorComponentName: string;
  generatorComponent?: GraphGeneratorComponent;
  positiveProbability: number;
}

function initState() {
  return {
    generatorComponentName: '',
    generatorComponent: undefined,
    positiveProbability: 0.5
  };
}

export const useGeneratorStore = defineStore('generator', {
  state: (): State => initState(),
  actions: {
    setGeneratorComponentName(generatorComponentName: string) {
      this.generatorComponentName = generatorComponentName;
    },
    setGeneratorComponent(generatorComponent: GraphGeneratorComponent) {
      this.generatorComponent = generatorComponent;
    },
    setPositiveProbability(positiveProbability: number) {
      this.positiveProbability = positiveProbability;
    },
    generateGraph() {
      if (this.generatorComponent) this.generatorComponent.generateGraph(this.positiveProbability);
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeneratorStore, import.meta.hot));
}
