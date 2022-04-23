<template>
  <div class="simulation-form">
    <span v-if="modelComponentName" class="p-float-label">
      <input-number :disabled="true" id="iterations" v-model="iterations" mode="decimal"></input-number>
      <label for="iterations">Number of simulation iterations</label>
    </span>
    <p v-if="!modelComponentName" class="simulation-form-hint">
      The parameters will be available after selecting model
    </p>
    <component v-if="modelComponentName" :is="modelComponentName"></component>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSimulationStore } from '@/stores/simulation.store';

const simulationStore = useSimulationStore();
const { iterations, modelComponentName } = storeToRefs(simulationStore);
</script>

<style scoped lang="scss">
@use '../../../styles/forms';

.simulation-form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  height: 100%;
  width: 90%;
  margin: 0 auto;
  overflow: auto;

  &-hint {
    @include forms.hint;
  }
}
</style>
