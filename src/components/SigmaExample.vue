<template>
  <div class="sigma-container" ref="sigmaContainer"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Sigma } from 'sigma';
import Graph from 'graphology';
import { parse } from 'graphology-gexf/browser';
import graphUrl from '@/assets/arctic.gexf';

export default defineComponent({
  data() {
    return {
      renderer: {} as Sigma
    };
  },
  mounted() {
    fetch(graphUrl)
      .then((res) => res.text())
      .then((gexf) => {
        const graph = parse(Graph, gexf);
        const container = this.$refs.sigmaContainer as HTMLDivElement;

        this.renderer = new Sigma(graph, container);
      });
  }
});
</script>

<style scoped lang="scss">
.sigma-container {
  position: fixed;
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
