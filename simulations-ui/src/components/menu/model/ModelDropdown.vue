<template>
  <dropdown
    class="simulation-model-dropdown"
    v-model="selectedModel"
    :options="options"
    :disabled="isRunning"
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
const { isRunning } = storeToRefs(simulationStore);

const selectedModel = ref<Option | null>(null);
const options = [{ label: 'Local Majority Rule', model: 'local-majority-rule-model' }];

watch(selectedModel, (newModel) => {
  modelStore.modelName = newModel?.model;
});
</script>

<style scoped lang="scss">
.simulation-model-dropdown {
  width: 100%;
}
</style>
