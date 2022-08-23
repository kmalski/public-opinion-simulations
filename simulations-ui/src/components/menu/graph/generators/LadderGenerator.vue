<template>
  <div class="ladder-generator">
    <span class="p-float-label">
      <input-number :min="2" id="ladderLength" v-model="state.ladderLength"></input-number>
      <label for="ladderLength">Length of the ladder</label>
    </span>

    <span class="form-input">
      <label class="form-input-label" for="closed">Closed ladder</label>
      <input-switch id="closed" v-model="state.closed"></input-switch>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import ladder from 'graphology-generators/classic/ladder';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/composables/useGenerator';

const state = reactive({
  ladderLength: 10,
  closed: false
});

function generateGraph() {
  const graph = ladder(Graph, state.ladderLength) as Graph;
  if (state.closed && state.ladderLength > 2) {
    const nodes = graph.filterNodes((node) => graph.neighbors(node).length === 2).sort();
    graph.addEdge(nodes[0], nodes[3]);
    graph.addEdge(nodes[1], nodes[2]);
  }
  return graph;
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.ladder-generator {
  @include tab.graph-generator;
}
</style>
