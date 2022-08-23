import { acceptHMRUpdate, defineStore } from 'pinia';
import { Optional } from '@/helpers/types';
import { ModelName } from '@/composables/useModel';
import { valid } from '@/helpers/utils';

export type ValidateFunc = () => boolean;

interface State {
  modelName: Optional<ModelName>;
  modelParams: Optional<object>;
  validateFunc: ValidateFunc;
}

export const useModelStore = defineStore('model', {
  state: (): State => ({
    modelName: undefined,
    modelParams: undefined,
    validateFunc: valid
  })
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useModelStore, import.meta.hot));
}
