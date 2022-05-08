<template>
  <div class="empty-generator">
    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="state.nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import empty from 'graphology-generators/classic/empty';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/composables/useGenerator';

const state = reactive({
  nodesNumber: 10
});

function generateGraph() {
  return empty(Graph, state.nodesNumber);
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.empty-generator {
  @include tab.graph-generator;
}
</style>
