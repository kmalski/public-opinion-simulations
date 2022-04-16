<template>
  <div class="erdos-renyi-generator">
    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
    </span>

    <span class="p-float-label">
      <input-number id="edgeProbability" v-model="edgeProbability"></input-number>
      <label for="edgeProbability">Probability for edge creation</label>
    </span>
  </div>
</template>

<script lang="ts">
import erdosRenyi from 'graphology-generators/random/erdos-renyi';
import { Graph } from '@/helpers/types';
import { defineComponent } from 'vue';
import GraphGenerator from '@/components/menu/graph/generator/GraphGenerator.vue';
import { assignOpinion } from '@/helpers/graph';

export default defineComponent({
  name: 'ErdosRenyiGenerator',
  extends: GraphGenerator,
  data() {
    return {
      nodesNumber: 10,
      edgeProbability: 0.5
    };
  },
  methods: {
    generateGraph(positiveProbability: number) {
      const graph = erdosRenyi(Graph, {
        order: this.nodesNumber,
        probability: this.edgeProbability
      });
      assignOpinion(graph, positiveProbability);
      this.setGraph(graph);
    }
  }
});
</script>

<style scoped lang="scss">
@use '../../../../styles/forms';

.erdos-renyi-generator {
  @include forms.graph-generator;
}
</style>
