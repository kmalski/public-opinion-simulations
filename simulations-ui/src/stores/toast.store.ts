import { acceptHMRUpdate, defineStore } from 'pinia';
import { Optional } from '@/helpers/types';

export interface Message {
  summary: string;
  detail: string;
}

interface State {
  error: Optional<Message>;
  success: Optional<Message>;
}

export const useToastStore = defineStore('toast', {
  state: (): State => ({
    error: undefined,
    success: undefined
  })
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToastStore, import.meta.hot));
}
