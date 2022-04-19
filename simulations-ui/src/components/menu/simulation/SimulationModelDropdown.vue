<template>
  <dropdown
    class="simulation-model-dropdown"
    v-model="selectedModel"
    :options="options"
    option-label="name"
    placeholder="Select Model"
  ></dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { useSimulationStore } from '@/stores/simulation.store';

export default defineComponent({
  name: 'SimulationModelDropdown',
  data() {
    return {
      options: [{ name: 'Local Majority Rule', model: 'local-majority-rule-model' }],
      selectedModel: null
    };
  },
  watch: {
    selectedModel(newModel) {
      this.setModelName(newModel.model);
    }
  },
  methods: {
    ...mapActions(useSimulationStore, ['setModelName'])
  }
});
</script>

<style scoped lang="scss">
.simulation-model-dropdown {
  width: 100%;
}
</style>
