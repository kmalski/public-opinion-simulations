<template>
  <div class="caveman-generator">
    <span class="p-float-label">
      <input-number id="clustersNumber" v-model="state.componentsNumber"></input-number>
      <label for="clustersNumber">Number of clusters</label>
    </span>

    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="state.nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes in cluster</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import caveman from 'graphology-generators/community/caveman';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/components/menu/graph/generator/useGenerator.';

const state = reactive({
  componentsNumber: 3,
  nodesNumber: 10
});

function generateGraph() {
  return caveman(Graph, state.componentsNumber, state.nodesNumber);
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.caveman-generator {
  @include tab.graph-generator;
}
</style>
