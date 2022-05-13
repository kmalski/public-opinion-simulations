import { onMounted, Ref, unref } from 'vue';
import { useModelStore } from '@/stores/model.store';
import { useSimulationStore } from '@/stores/simulation.store';
import { storeToRefs } from 'pinia';

export type ModelName = 'local-majority-rule-model';

export function useModel(model: Ref<object> | object) {
  const modelStore = useModelStore();
  const simulationStore = useSimulationStore();
  const { isRunning } = storeToRefs(simulationStore);

  onMounted(() => {
    modelStore.model = unref(model);
  });

  return { isRunning };
}
