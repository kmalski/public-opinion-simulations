import { onMounted, Ref, unref } from 'vue';
import { useSimulationStore } from '@/stores/simulation.store';

export function useModel(model: Ref<object> | object) {
  const simulationStore = useSimulationStore();
  onMounted(() => {
    simulationStore.model = unref(model);
  });
}
