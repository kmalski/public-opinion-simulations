<template>
  <div class="complete-generator">
    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="state.nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import complete from 'graphology-generators/classic/complete';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/components/menu/graph/generator/useGenerator.';

const state = reactive({
  nodesNumber: 10
});

function generateGraph() {
  return complete(Graph, state.nodesNumber);
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.complete-generator {
  @include tab.graph-generator;
}
</style>
