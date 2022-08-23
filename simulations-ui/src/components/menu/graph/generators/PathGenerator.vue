<template>
  <div class="path-generator">
    <span class="p-float-label">
      <input-number :min="2" id="nodesNumber" v-model="state.nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
    </span>

    <span class="form-input">
      <label class="form-input-label" for="closed">Closed path</label>
      <input-switch id="closed" v-model="state.closed"></input-switch>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import path from 'graphology-generators/classic/path';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/composables/useGenerator';

const state = reactive({
  nodesNumber: 10,
  closed: false
});

function generateGraph() {
  const graph = path(Graph, state.nodesNumber) as Graph;
  if (state.closed && state.nodesNumber > 2) {
    const nodes = graph.filterNodes((node) => graph.neighbors(node).length === 1);
    graph.addEdge(nodes[0], nodes[1]);
  }
  return graph;
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
