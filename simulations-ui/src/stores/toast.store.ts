import { acceptHMRUpdate, defineStore } from 'pinia';
import { Optional } from '@/helpers/types';

export interface ErrorMessage {
  summary: string;
  detail: string;
}

interface State {
  error: Optional<ErrorMessage>;
}

export const useToastStore = defineStore('toast', {
  state: (): State => ({
    error: undefined
  })
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToastStore, import.meta.hot));
}
