<template>
  <div class="connected-caveman-generator">
    <span class="p-float-label">
      <input-number :min="1" id="clustersNumber" v-model="state.componentsNumber"></input-number>
      <label for="clustersNumber">Number of clusters</label>
    </span>

    <span class="p-float-label">
      <input-number :min="1" id="nodesNumber" v-model="state.nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes in cluster</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import connectedCaveman from 'graphology-generators/community/connected-caveman';
import { Graph } from '@/helpers/types';
import { reactive } from 'vue';
import { useGenerator } from '@/composables/useGenerator';

const state = reactive({
  componentsNumber: 3,
  nodesNumber: 10
});

function generateGraph() {
  return connectedCaveman(Graph, state.componentsNumber, state.nodesNumber) as Graph;
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.connected-caveman-generator {
  @include tab.graph-generator;
}
</style>
