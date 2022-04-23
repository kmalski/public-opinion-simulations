import { acceptHMRUpdate, defineStore } from 'pinia';

export interface ErrorMessage {
  summary: string;
  detail: string;
}

interface State {
  error?: ErrorMessage;
}

function initState(): State {
  return {
    error: undefined
  };
}

export const useToastStore = defineStore('toast', {
  state: (): State => initState(),
  actions: {
    setError(error: ErrorMessage) {
      this.error = error;
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToastStore, import.meta.hot));
}
