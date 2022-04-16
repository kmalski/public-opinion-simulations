<template>
  <div class="caveman-generator">
    <span class="p-float-label">
      <input-number id="clustersNumber" v-model="componentsNumber"></input-number>
      <label for="clustersNumber">Number of clusters</label>
    </span>

    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes in cluster</label>
    </span>
  </div>
</template>

<script lang="ts">
import caveman from 'graphology-generators/community/caveman';
import { Graph } from '@/helpers/types';
import { defineComponent } from 'vue';
import GraphGenerator from '@/components/menu/graph/generator/GraphGenerator.vue';
import { assignOpinion } from '@/helpers/graph';

export default defineComponent({
  name: 'CavemanGenerator',
  extends: GraphGenerator,
  data() {
    return {
      componentsNumber: 3,
      nodesNumber: 10
    };
  },
  methods: {
    generateGraph(positiveProbability: number) {
      const graph = caveman(Graph, this.componentsNumber, this.nodesNumber);
      assignOpinion(graph, positiveProbability);
      this.setGraph(graph);
    }
  }
});
</script>

<style scoped lang="scss">
@use '../../../../styles/forms';

.caveman-generator {
  @include forms.graph-generator;
}
</style>
