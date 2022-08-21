import { onMounted, Ref, unref } from 'vue';
import { useModelStore } from '@/stores/model.store';
import { useSimulationStore } from '@/stores/simulation.store';
import { storeToRefs } from 'pinia';

export enum ModelName {
  MAJORITY_MODEL = 'MajorityModel',
  VOTER_MODEL = 'VoterModel',
  SZNAJD_MODEL = 'SznajdModel',
  Q_VOTER_MODEL = 'QVoterModel'
}

export function useModel(modelParams: Ref<object> | object) {
  const modelStore = useModelStore();
  const simulationStore = useSimulationStore();
  const { isRunning, isPause } = storeToRefs(simulationStore);

  onMounted(() => {
    modelStore.modelParams = unref(modelParams);
  });

  return { isRunning, isPause };
}
