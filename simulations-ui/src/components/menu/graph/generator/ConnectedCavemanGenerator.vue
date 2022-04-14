<template>
  <div class="connected-caveman-generator">
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
import connectedCaveman from 'graphology-generators/community/connected-caveman';
import { Graph } from '@/helpers/types';
import { defineComponent } from 'vue';
import GraphGenerator from '@/components/menu/graph/generator/GraphGenerator.vue';

export default defineComponent({
  name: 'ConnectedCavemanGenerator',
  extends: GraphGenerator,
  data() {
    return {
      componentsNumber: 3,
      nodesNumber: 10
    };
  },
  methods: {
    generateGraph() {
      const graph = connectedCaveman(Graph, this.componentsNumber, this.nodesNumber);
      this.setGraph(graph);
    }
  }
});
</script>

<style scoped lang="scss">
.connected-caveman-generator {
  width: 90%;
}
</style>
