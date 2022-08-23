<template>
  <div class="florentine-families-generator"></div>
</template>

<script setup lang="ts">
import florentineFamilies from 'graphology-generators/social/florentine-families';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/composables/useGenerator';

function generateGraph() {
  return florentineFamilies(Graph) as Graph;
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.florentine-families-generator {
  @include tab.graph-generator;
}
</style>
