<template>
  <dropdown
    class="simulation-model-dropdown"
    v-model="selectedModel"
    :options="options"
    :disabled="isRunning"
    option-label="name"
    placeholder="Select Model"
  ></dropdown>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useModelStore } from '@/stores/model.store';
import { useSimulationStore } from '@/stores/simulation.store';
import { storeToRefs } from 'pinia';

interface Option {
  name: string;
  model: string;
}

const modelStore = useModelStore();
const simulationStore = useSimulationStore();
const { isRunning } = storeToRefs(simulationStore);

const selectedModel = ref<Option | null>(null);
const options = [{ name: 'Local Majority Rule', model: 'local-majority-rule-model' }];

watch(selectedModel, (newModel) => {
  modelStore.modelComponentName = newModel?.model;
});
</script>

<style scoped lang="scss">
.simulation-model-dropdown {
  width: 100%;
}
</style>
