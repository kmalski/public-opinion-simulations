<template>
  <div class="clusters-generator">
    <span class="p-float-label">
      <input-number :min="2" id="nodesNumber" v-model="state.nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
    </span>

    <span class="p-float-label">
      <input-number :min="1" id="edgesNumber" v-model="state.edgesNumber"></input-number>
      <label for="edgesNumber">Number of edges</label>
    </span>

    <span class="p-float-label">
      <input-number :min="1" id="clustersNumber" v-model="state.clustersNumber"></input-number>
      <label for="clustersNumber">Number of clusters</label>
    </span>

    <span class="p-float-label">
      <input-number
        :min="0"
        :max="1"
        id="clusterDensity"
        v-model="state.clusterDensity"
        mode="decimal"
        :max-fraction-digits="2"
      ></input-number>
      <label for="clusterDensity">Cluster density</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import clusters from 'graphology-generators/random/clusters';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/composables/useGenerator';

const state = reactive({
  nodesNumber: 10,
  edgesNumber: 20,
  clustersNumber: 2,
  clusterDensity: 0.5
});

function generateGraph() {
  return clusters(Graph, {
    order: state.nodesNumber,
    size: state.edgesNumber,
    clusters: state.clustersNumber,
    clusterDensity: state.clusterDensity
  });
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.clusters-generator {
  @include tab.graph-generator;
}
</style>
