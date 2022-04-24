<template>
  <div class="ladder-generator">
    <span class="p-float-label">
      <input-number id="ladderLength" v-model="state.ladderLength"></input-number>
      <label for="ladderLength">Length of the ladder</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import ladder from 'graphology-generators/classic/ladder';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/components/menu/graph/generator/useGenerator.';

const state = reactive({
  ladderLength: 10
});

function generateGraph() {
  return ladder(Graph, state.ladderLength);
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
