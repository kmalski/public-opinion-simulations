<template>
  <div class="graph-generator regular-square-generator">
    <span class="p-float-label">
      <input-number id="nodesDegree" v-model="state.height"></input-number>
      <label for="nodesDegree">Height of square mesh</label>
    </span>

    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="state.width"></input-number>
      <label for="nodesNumber">Width of square mesh</label>
    </span>

    <span class="form-input">
      <label class="form-input-label" for="periodicBoundary">Periodic boundaries</label>
      <input-switch id="periodicBoundary" v-model="state.periodicBoundary"></input-switch>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Graph } from '@/helpers/types';
import { useGenerator } from '@/components/menu/graph/generator/useGenerator.';

const state = reactive({
  height: 5,
  width: 5,
  periodicBoundary: false
});

function generateGraph() {
  const graph = new Graph();
  const periodicBoundary = state.periodicBoundary;
  const width = state.width;
  const height = state.height;
  const order = width * height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      graph.addNode(x + y * width, {
        x: x,
        y: y
      });
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = x + y * width;
      const targetX = ((x + 1) % width) + width * y;
      const targetY = (i + width) % order;
      if (width > 1 && (targetX > i || periodicBoundary)) graph.mergeEdge(i, targetX);
      if (height > 1 && (targetY > i || periodicBoundary)) graph.mergeEdge(i, targetY);
    }
  }
  return graph;
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.regular-square-generator {
  @include tab.graph-generator;
}
</style>
