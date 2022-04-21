<template>
  <div class="empty-generator">
    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import empty from 'graphology-generators/classic/empty';
import { Graph } from '@/helpers/types';
import { assignOpinion } from '@/helpers/graph';
import GraphGenerator from '@/components/menu/graph/generator/GraphGenerator.vue';

export default defineComponent({
  name: 'EmptyGenerator',
  extends: GraphGenerator,
  data() {
    return {
      nodesNumber: 10
    };
  },
  methods: {
    generateGraph(positiveProbability: number) {
      const graph = empty(Graph, this.nodesNumber);
      assignOpinion(graph, positiveProbability);
      this.setGraph(graph);
    }
  }
});
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.empty-generator {
  @include tab.graph-generator;
}
</style>
