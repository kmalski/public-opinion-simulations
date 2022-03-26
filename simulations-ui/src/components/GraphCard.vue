<template>
  <div class="graph-card">
    <card>
      <template #content>
        <div class="container" ref="container"></div>
      </template>
    </card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Sigma } from 'sigma';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import FA2LayoutSupervisor from 'graphology-layout-forceatlas2/worker';
import { parseGexf } from '@/helpers/parser';
import graphUrl from '@/assets/arctic.gexf';

export default defineComponent({
  name: 'GraphCard',
  data() {
    return {
      renderer: {} as Sigma
    };
  },
  async mounted() {
    const graph = await parseGexf(graphUrl);
    const container = this.$refs.container as HTMLDivElement;
    const sensibleSettings = forceAtlas2.inferSettings(graph);
    const fa2Layout = new FA2LayoutSupervisor(graph, {
      settings: sensibleSettings
    });
    fa2Layout.start();
    this.renderer = new Sigma(graph, container);
    setTimeout(() => fa2Layout.stop(), 5000);
  }
});
</script>

<style scoped lang="scss">
.graph-card {
  height: 100%;
  width: 100%;
}

::v-deep(.p-card) {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;

  .p-card-body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;

    .p-card-content {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
  }
}

.container {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
