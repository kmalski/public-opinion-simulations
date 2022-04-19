<template>
  <div class="simulation-tab">
    <simulation-model-dropdown></simulation-model-dropdown>
    <p v-if="!modelName" class="simulation-tab-hint">The parameters will be available after selecting model</p>
    <component v-if="modelName" :is="modelName"></component>
    <prime-button
      :disabled="!model"
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
import LocalMajorityRuleModel from '@/components/menu/simulation/model/LocalMajorityRuleModel.vue';

export default defineComponent({
  name: 'SimulationTab',
  components: {
    SimulationModelDropdown,
    LocalMajorityRuleModel
  },
  computed: {
    ...mapState(useSimulationStore, ['model', 'modelName'])
  },
  methods: {
    ...mapActions(useSimulationStore, ['runSimulation'])
  }
});
</script>

<style scoped lang="scss">
.simulation-tab {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: center;
  height: 100%;
  max-height: 100%;

  &-hint {
    width: 90%;
    margin: auto;
    text-align: left;
    height: 100%;
  }

  &-button {
    justify-self: flex-end;
    margin: 2rem auto 0 auto;
    width: 90%;
    overflow: visible;
  }

  .p-dropdown {
    width: 90%;
    margin: 1rem auto;
  }
}
</style>
