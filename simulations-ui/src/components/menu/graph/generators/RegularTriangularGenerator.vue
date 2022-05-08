<template>
  <div class="graph-generator regular-triangular-generator">
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
import { useGenerator } from '@/composables/useGenerator';

const state = reactive({
  height: 5,
  width: 5,
  periodicBoundary: false
});

function generateGraph() {
  const graph = new Graph();
  const { width, height, periodicBoundary } = state;
  const order = width * height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = x + y * width;

      if (width > 1) {
        const targetX = ((x + 1) % width) + width * y;
        if (targetX > i || periodicBoundary) graph.mergeEdge(i, targetX);
      }

      if (height > 1) {
        const targetY1 = (i + width) % order;
        if (targetY1 > i || periodicBoundary) graph.mergeEdge(i, targetY1);

        const notFarRight = x !== width - 1;
        const targetY2 = notFarRight ? (i + width + 1) % order : (i + 1) % order;
        if ((targetY2 > i && notFarRight) || periodicBoundary) graph.mergeEdge(i, targetY2);
      }
      graph.replaceNodeAttributes(i, { x: x - y / 3, y });
    }
  }
  return graph;
}

useGenerator(generateGraph);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.regular-triangular-generator {
  @include tab.graph-generator;
}
</style>
