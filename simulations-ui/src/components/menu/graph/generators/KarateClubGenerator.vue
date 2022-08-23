<template>
  <div class="karate-club-generator"></div>
</template>

<script setup lang="ts">
import karateClub from 'graphology-generators/social/karate-club';
import circular from 'graphology-layout/circular';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/composables/useGenerator';

function generateGraph() {
  const graph = karateClub(Graph) as Graph;
  circular.assign(graph);
  return graph;
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.karate-club-generator {
  @include tab.graph-generator;
}
</style>
