<template>
  <div class="simulation-tab">
    <simulation-model-dropdown class="simulation-tab-dropdown"></simulation-model-dropdown>
    <simulation-model-form></simulation-model-form>
    <progress-bar v-if="isRunning" :value="simulationPercentage"></progress-bar>
    <prime-button
      :disabled="!modelComponent || isRunning"
      class="simulation-tab-button"
      label="Run Simulation"
      @click="runSimulation"
    ></prime-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useSimulationStore } from '@/stores/simulation.store';
import SimulationModelDropdown from '@/components/menu/simulation/SimulationModelDropdown.vue';
import SimulationModelForm from '@/components/menu/simulation/SimulationModelForm.vue';

export default defineComponent({
  name: 'SimulationTab',
  components: {
    SimulationModelForm,
    SimulationModelDropdown
  },
  computed: {
    ...mapState(useSimulationStore, ['modelComponent', 'isRunning', 'iterations', 'step']),
    simulationPercentage() {
      if (this.step && this.iterations) {
        return Math.trunc((this.step / this.iterations) * 100);
      } else return 0;
    }
  },
  methods: {
    ...mapActions(useSimulationStore, ['runSimulation'])
  }
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
