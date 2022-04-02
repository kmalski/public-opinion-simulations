<template>
  <div class="graph-container" ref="graph-container"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Sigma } from 'sigma';
import { Graph, Optional } from '@/helpers/types';

export default defineComponent({
  name: 'GraphContainer',
  data() {
    return {
      renderer: null as Optional<Sigma>
    };
  },
  mounted() {
    this.$store.commit('setGraph', this.createExampleGraph());
  },
  methods: {
    createExampleGraph() {
      const graph = new Graph();
      graph.addNode('n1', { x: 0, y: 0, size: 10, label: '-1', color: '#f51b00' });
      graph.addNode('n2', { x: -5, y: 5, size: 10, label: '1', color: '#009dff' });
      graph.addNode('n3', { x: 5, y: 5, size: 10, label: '1', color: '#009dff' });
      graph.addNode('n4', { x: 0, y: 10, size: 10, label: '-1', color: '#f51b00' });
      graph.addEdge('n1', 'n2');
      graph.addEdge('n2', 'n4');
      graph.addEdge('n4', 'n3');
      graph.addEdge('n3', 'n1');
      return graph;
    }
  },
  computed: {
    graph() {
      return this.$store.state.graph;
    }
  },
  watch: {
    graph(newGraph) {
      if (this.renderer instanceof Sigma) this.renderer.kill();
      const container = this.$refs['graph-container'] as HTMLDivElement;
      this.renderer = new Sigma(newGraph, container);
    }
  }
});
</script>

<style scoped lang="scss">
.graph-container {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
