<template>
  <div class="girvan-newman-generator">
    <span class="p-float-label">
      <input-number id="zOut" v-model="state.zOut" mode="decimal" :max-fraction-digits="2"></input-number>
      <label for="zOut">zOut parameter</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import girvanNewman from 'graphology-generators/random/girvan-newman';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/components/menu/graph/generator/useGenerator.';

const state = reactive({
  zOut: 4
});

function generateGraph() {
  return girvanNewman(Graph, { zOut: state.zOut });
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.girvan-newman-generator {
  @include tab.graph-generator;
}
</style>
