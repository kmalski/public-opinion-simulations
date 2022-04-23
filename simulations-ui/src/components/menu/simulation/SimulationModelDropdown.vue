<template>
  <dropdown
    :disabled="isRunning"
    class="simulation-model-dropdown"
    v-model="selectedModel"
    :options="options"
    option-label="name"
    placeholder="Select Model"
  ></dropdown>
</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSimulationStore } from '@/stores/simulation.store';

interface Option {
  name: string;
  modelComponentName: string;
}

const simulationStore = useSimulationStore();
const { isRunning } = storeToRefs(simulationStore);
const selectedModel = shallowRef<Option | undefined>(undefined);
const options = [{ name: 'Local Majority Rule', modelComponentName: 'local-majority-rule-model' }];

watch(selectedModel, (newModel) => {
  simulationStore.modelComponentName = newModel?.modelComponentName;
});
</script>

<style scoped lang="scss">
.simulation-model-dropdown {
  width: 100%;
}
</style>
