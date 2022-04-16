<template>
  <div class="clusters-generator">
    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
    </span>

    <span class="p-float-label">
      <input-number id="edgesNumber" v-model="edgesNumber"></input-number>
      <label for="edgesNumber">Number of edges</label>
    </span>

    <span class="p-float-label">
      <input-number id="clustersNumber" v-model="clustersNumber"></input-number>
      <label for="clustersNumber">Number of clusters</label>
    </span>

    <span class="p-float-label">
      <input-number id="clusterDensity" v-model="clusterDensity" mode="decimal" :max-fraction-digits="2"></input-number>
      <label for="clusterDensity">Cluster density</label>
    </span>
  </div>
</template>

<script lang="ts">
import clusters from 'graphology-generators/random/clusters';
import { Graph } from '@/helpers/types';
import { defineComponent } from 'vue';
import GraphGenerator from '@/components/menu/graph/generator/GraphGenerator.vue';
import { assignOpinion } from '@/helpers/graph';

export default defineComponent({
  name: 'ClustersGenerator',
  extends: GraphGenerator,
  data() {
    return {
      nodesNumber: 10,
      edgesNumber: 20,
      clustersNumber: 2,
      clusterDensity: 0.5
    };
  },
  methods: {
    generateGraph(positiveProbability: number) {
      const graph = clusters(Graph, {
        order: this.nodesNumber,
        size: this.edgesNumber,
        clusters: this.clustersNumber,
        clusterDensity: this.clusterDensity
      });
      assignOpinion(graph, positiveProbability);
      this.setGraph(graph);
    }
  }
});
</script>

<style scoped lang="scss">
@use '../../../../styles/forms';

.clusters-generator {
  @include forms.graph-generator;
}
</style>
