<template>
  <div class="graph-tab">
    <graph-upload></graph-upload>
    <divider></divider>
    <p class="graph-tab-hint">Enter the graph parameters</p>
    <graph-generator-dropdown class="graph-tab-dropdown"></graph-generator-dropdown>
    <graph-generator-form></graph-generator-form>
    <prime-button
      :disabled="!generatorComponent || isRunning"
      class="graph-tab-button"
      label="Generate"
      @click="generateGraph"
    ></prime-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useGeneratorStore } from '@/stores/generator.store';
import GraphUpload from '@/components/menu/graph/GraphUpload.vue';
import GraphGeneratorDropdown from '@/components/menu/graph/GraphGeneratorDropdown.vue';
import GraphGeneratorForm from '@/components/menu/graph/GraphGeneratorForm.vue';
import { useSimulationStore } from '@/stores/simulation.store';

export default defineComponent({
  name: 'GraphTab',
  components: {
    GraphUpload,
    GraphGeneratorDropdown,
    GraphGeneratorForm
  },
  computed: {
    ...mapState(useGeneratorStore, ['generatorComponent']),
    ...mapState(useSimulationStore, ['isRunning'])
  },
  methods: {
    ...mapActions(useGeneratorStore, ['generateGraph'])
  }
});
</script>

<style scoped lang="scss">
@use '../../../styles/tab';

.graph-tab {
  @include tab.tab;
}
</style>
