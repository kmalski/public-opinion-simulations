<template>
  <div class="path-generator">
    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="state.nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import path from 'graphology-generators/classic/path';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/composables/useGenerator';

const state = reactive({
  nodesNumber: 10
});

function generateGraph() {
  return path(Graph, state.nodesNumber);
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.path-generator {
  @include tab.graph-generator;
}
</style>
