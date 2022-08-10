import { acceptHMRUpdate, defineStore } from 'pinia';
import { Optional } from '@/helpers/types';
import { ModelName } from '@/composables/useModel';

interface State {
  modelName: Optional<ModelName>;
  modelParams: Optional<object>;
}

export const useModelStore = defineStore('model', {
  state: (): State => ({
    modelName: undefined,
    modelParams: undefined
  })
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useModelStore, import.meta.hot));
}
