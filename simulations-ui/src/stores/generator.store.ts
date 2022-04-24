import { acceptHMRUpdate, defineStore } from 'pinia';
import { Optional } from '@/helpers/types';

interface State {
  positiveProbability: number;
  generatorComponentName: Optional<string>;
  generate: Optional<() => void>;
}

export const useGeneratorStore = defineStore('generator', {
  state: (): State => ({
    positiveProbability: 0.5,
    generatorComponentName: undefined,
    generate: undefined
  })
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeneratorStore, import.meta.hot));
}
