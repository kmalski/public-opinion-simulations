import { acceptHMRUpdate, defineStore } from 'pinia';
import { GraphGenerator } from '@/components/menu/graph/generator/GraphGenerator.vue';

interface State {
  generatorName: string;
  positiveProbability: number;
  generator?: GraphGenerator;
}

function initState() {
  return { generatorName: '', generator: undefined, positiveProbability: 0.5 };
}

export const useGeneratorStore = defineStore('generator', {
  state: (): State => initState(),
  actions: {
    setGeneratorName(generatorName: string) {
      this.generatorName = generatorName;
    },
    setGenerator(generator: GraphGenerator) {
      this.generator = generator;
    },
    setPositiveProbability(positiveProbability: number) {
      this.positiveProbability = positiveProbability;
    },
    generateGraph() {
      if (this.generator) this.generator.generateGraph(this.positiveProbability);
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeneratorStore, import.meta.hot));
}
