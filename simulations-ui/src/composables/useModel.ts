import { onMounted, Ref, unref } from 'vue';
import { useModelStore, ValidateFunc } from '@/stores/model.store';
import { useSimulationStore } from '@/stores/simulation.store';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast.store';
import { useGraphStore } from '@/stores/graph.store';

export enum ModelName {
  MAJORITY_MODEL = 'MajorityModel',
  VOTER_MODEL = 'VoterModel',
  SZNAJD_MODEL = 'SznajdModel',
  Q_VOTER_MODEL = 'QVoterModel'
}

export function useModel(modelParams: Ref<object> | object, validateFunc: ValidateFunc) {
  const modelStore = useModelStore();
  const simulationStore = useSimulationStore();
  const toastStore = useToastStore();
  const graphStore = useGraphStore();
  const { isRunning, isPause } = storeToRefs(simulationStore);

  const validate = () => {
    if (graphStore.graph.order === 0) {
      toastStore.error = {
        summary: 'Empty graph',
        detail: 'Empty graph can not be used as a simulation input'
      };
      return false;
    }

    return validateFunc();
  };

  onMounted(() => {
    modelStore.modelParams = unref(modelParams);
    modelStore.validateFunc = validate;
  });

  return { isRunning, isPause };
}
