<template>
  <dropdown
    class="simulation-model-dropdown"
    v-model="selectedOption"
    :options="options"
    :disabled="isRunning || isPause"
    option-label="label"
    placeholder="Select Model"
  ></dropdown>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useModelStore } from '@/stores/model.store';
import { useSimulationStore } from '@/stores/simulation.store';
import { ModelName } from '@/composables/useModel';

interface Option {
  label: string;
  model: ModelName;
}

const modelStore = useModelStore();
const simulationStore = useSimulationStore();
const { isRunning, isPause } = storeToRefs(simulationStore);

const selectedOption = ref<Option | null>(null);
const options = [
  { label: 'Majority', model: ModelName.MAJORITY_MODEL },
  { label: 'Voter', model: ModelName.VOTER_MODEL },
  { label: 'Sznajd', model: ModelName.SZNAJD_MODEL },
  { label: 'Q-Voter', model: ModelName.Q_VOTER_MODEL }
] as Array<Option>;

watch(selectedOption, (newOption) => {
  modelStore.modelName = newOption?.model;
});
</script>

<style scoped lang="scss">
.simulation-model-dropdown {
  width: 100%;
}
</style>
