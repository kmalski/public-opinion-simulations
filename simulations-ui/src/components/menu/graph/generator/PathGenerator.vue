<template>
  <div class="path-generator">
    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import path from 'graphology-generators/classic/path';
import { Graph } from '@/helpers/types';
import { assignOpinion } from '@/helpers/graph';
import GraphGenerator from '@/components/menu/graph/generator/GraphGenerator.vue';

export default defineComponent({
  name: 'PathGenerator',
  extends: GraphGenerator,
  data() {
    return {
      nodesNumber: 10
    };
  },
  methods: {
    generateGraph(positiveProbability: number) {
      const graph = path(Graph, this.nodesNumber);
      assignOpinion(graph, positiveProbability);
      this.setGraph(graph);
    }
  }
});
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.path-generator {
  @include tab.graph-generator;
}
</style>
