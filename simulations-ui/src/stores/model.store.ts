import { acceptHMRUpdate, defineStore } from 'pinia';
import { Optional } from '@/helpers/types';

interface State {
  modelComponentName: Optional<string>;
  model: Optional<object>;
}

export const useModelStore = defineStore('model', {
  state: (): State => ({
    modelComponentName: undefined,
    model: undefined
  })
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useModelStore, import.meta.hot));
}
