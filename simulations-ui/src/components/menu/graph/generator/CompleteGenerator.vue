<template>
  <div class="complete-generator">
    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import complete from 'graphology-generators/classic/complete';
import { Graph } from '@/helpers/types';
import { assignOpinion } from '@/helpers/parser';
import GraphGenerator from '@/components/menu/graph/generator/GraphGenerator.vue';

export default defineComponent({
  name: 'CompleteGenerator',
  extends: GraphGenerator,
  data() {
    return {
      nodesNumber: 10
    };
  },
  methods: {
    generateGraph(positiveProbability: number) {
      const graph = complete(Graph, this.nodesNumber);
      assignOpinion(graph, positiveProbability);
      this.setGraph(graph);
    }
  }
});
</script>

<style scoped lang="scss">
.complete-generator {
  width: 100%;
}
</style>
