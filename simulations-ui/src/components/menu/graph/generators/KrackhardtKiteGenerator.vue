<template>
  <div class="krackhardt-kite-generator"></div>
</template>

<script setup lang="ts">
import krackhardtKite from 'graphology-generators/small/krackhardt-kite';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/composables/useGenerator';

function generateGraph() {
  return krackhardtKite(Graph);
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.krackhardt-kite-generator {
  @include tab.graph-generator;
}
</style>
