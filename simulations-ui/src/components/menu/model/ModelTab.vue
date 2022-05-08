<template>
  <div class="model-tab">
    <model-dropdown class="model-tab-dropdown"></model-dropdown>
    <model-form></model-form>
    <prime-button
      :disabled="!modelComponentName || isOpen"
      class="model-tab-button"
      label="Open simulation panel"
      @click="openSimulationModal"
    ></prime-button>
    <simulation-dialog v-model="isOpen"></simulation-dialog>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useModelStore } from '@/stores/model.store';
import { useSimulationStore } from '@/stores/simulation.store';
import ModelDropdown from '@/components/menu/model/ModelDropdown.vue';
import ModelForm from '@/components/menu/model/ModelForm.vue';
import SimulationDialog from '@/components/simulation/SimulationDialog.vue';

const modelStore = useModelStore();
const simulationStore = useSimulationStore();
const { modelComponentName } = storeToRefs(modelStore);
const { isOpen } = storeToRefs(simulationStore);

function openSimulationModal() {
  isOpen.value = true;
}
</script>

<style scoped lang="scss">
@use '../../../styles/tab';

.model-tab {
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
