<template>
  <div class="erdos-renyi-generator">
    <span class="p-float-label">
      <input-number :min="1" id="nodesNumber" v-model="state.nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
    </span>

    <span class="p-float-label">
      <input-number
        :min="0"
        :max="1"
        id="edgeProbability"
        v-model="state.edgeProbability"
        mode="decimal"
        :max-fraction-digits="2"
      ></input-number>
      <label for="edgeProbability">Probability for edge creation</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import erdosRenyi from 'graphology-generators/random/erdos-renyi';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/composables/useGenerator';

const state = reactive({
  nodesNumber: 10,
  edgeProbability: 0.5
});

function generateGraph() {
  return erdosRenyi(Graph, {
    order: state.nodesNumber,
    probability: state.edgeProbability
  }) as Graph;
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.erdos-renyi-generator {
  @include tab.graph-generator;
}
</style>
