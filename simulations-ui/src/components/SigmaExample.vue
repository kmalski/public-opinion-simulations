<template>
  <div class="sigma-container" ref="sigmaContainer"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Sigma } from 'sigma';
import { parseDot } from '@/util/graph-parser/dot.parser';
import dotGraphUrl from '@/assets/graph.dot';
import FA2LayoutSupervisor from 'graphology-layout-forceatlas2/worker';
import forceAtlas2 from 'graphology-layout-forceatlas2';

export default defineComponent({
  data() {
    return {
      renderer: {} as Sigma
    };
  },
  async mounted() {
    const graph = await parseDot(dotGraphUrl);
    const container = this.$refs.sigmaContainer as HTMLDivElement;
    const sensibleSettings = forceAtlas2.inferSettings(graph);
    const fa2Layout = new FA2LayoutSupervisor(graph, {
      settings: sensibleSettings
    });
    fa2Layout.start();
    this.renderer = new Sigma(graph, container);
    setTimeout(() => fa2Layout.stop(), 2000);
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
