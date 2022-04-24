<template>
  <div class="graph-generator regular-generator">
    <span class="p-float-label">
      <input-number id="nodesDegree" v-model="state.nodesDegree"></input-number>
      <label for="nodesDegree">Degree of each node</label>
    </span>

    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="state.nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
    </span>

    <span class="form-input">
      <label class="form-input-label" for="periodicBoundary">Periodic boundaries</label>
      <input-switch id="periodicBoundary" v-model="state.periodicBoundary"></input-switch>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/components/menu/graph/generator/useGenerator.';

const state = reactive({
  nodesDegree: 3,
  nodesNumber: 10,
  periodicBoundary: false
});

function generateGraph() {
  return new Graph();
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.regular-generator {
  @include tab.graph-generator;
}
</style>
