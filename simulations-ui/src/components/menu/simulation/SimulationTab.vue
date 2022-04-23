<template>
  <div class="simulation-tab">
    <simulation-model-dropdown class="simulation-tab-dropdown"></simulation-model-dropdown>
    <simulation-model-form></simulation-model-form>
    <progress-bar v-if="isRunning" :value="simulationPercentage"></progress-bar>
    <prime-button
      :disabled="!modelComponentName || isRunning"
      class="simulation-tab-button"
      label="Run Simulation"
      @click="simulationStore.runSimulation"
    ></prime-button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSimulationStore } from '@/stores/simulation.store';
import SimulationModelDropdown from '@/components/menu/simulation/SimulationModelDropdown.vue';
import SimulationModelForm from '@/components/menu/simulation/SimulationModelForm.vue';
import { computed } from 'vue';

const simulationStore = useSimulationStore();
const { modelComponentName, isRunning, iterations, step } = storeToRefs(simulationStore);

const simulationPercentage = computed(() => {
  if (step?.value && iterations?.value) {
    return Math.trunc((step.value / iterations.value) * 100);
  } else return 0;
});
</script>

<style scoped lang="scss">
@use '../../../styles/tab';

.simulation-tab {
  @include tab.tab;

  &-button {
    margin: 1rem auto 0 auto;
  }

  :deep(.p-progressbar) {
    width: 90%;
    margin: 0.5rem auto;
  }
}
</style>
