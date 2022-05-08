<template>
  <div class="graph-tab">
    <graph-upload></graph-upload>
    <divider></divider>
    <p class="graph-tab-text">Enter the graph parameters</p>
    <graph-generator-dropdown class="graph-tab-dropdown"></graph-generator-dropdown>
    <graph-generator-form></graph-generator-form>
    <p v-if="isOpen" class="graph-tab-hint translate-y">Before a new graph can be generated, the simulation must end</p>
    <prime-button
      :disabled="!generatorComponentName || isOpen"
      class="graph-tab-button"
      label="Generate"
      @click="generate"
    ></prime-button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGeneratorStore } from '@/stores/generator.store';
import { useSimulationStore } from '@/stores/simulation.store';
import GraphUpload from '@/components/menu/graph/GraphUpload.vue';
import GraphGeneratorDropdown from '@/components/menu/graph/GraphGeneratorDropdown.vue';
import GraphGeneratorForm from '@/components/menu/graph/GraphGeneratorForm.vue';

const generatorStore = useGeneratorStore();
const simulationStore = useSimulationStore();
const { generatorComponentName, generate } = storeToRefs(generatorStore);
const { isOpen } = storeToRefs(simulationStore);
</script>

<style scoped lang="scss">
@use '../../../styles/tab';
@use '../../../styles/variables';

.graph-tab {
  @include tab.tab;

  .translate-y {
    transform: translateY(1rem);
    width: 90%;
    margin: auto;
  }
}
</style>
