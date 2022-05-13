import { acceptHMRUpdate, defineStore } from 'pinia';
import { Optional } from '@/helpers/types';
import { GeneratorName } from '@/composables/useGenerator';

interface State {
  positiveProbability: number;
  generatorName: Optional<GeneratorName>;
  generate: Optional<() => void>;
}

export const useGeneratorStore = defineStore('generator', {
  state: (): State => ({
    positiveProbability: 0.5,
    generatorName: undefined,
    generate: undefined
  })
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeneratorStore, import.meta.hot));
}
