<template>
  <div class="girvan-newman-generator">
    <span class="p-float-label">
      <input-number id="zOut" v-model="zOut"></input-number>
      <label for="zOut">zOut parameter</label>
    </span>
  </div>
</template>

<script lang="ts">
import girvanNewman from 'graphology-generators/random/girvan-newman';
import { Graph } from '@/helpers/types';
import { defineComponent } from 'vue';
import GraphGenerator from '@/components/menu/graph/generator/GraphGenerator.vue';
import { assignOpinion } from '@/helpers/parser';

export default defineComponent({
  name: 'GirvanNewmanGenerator',
  extends: GraphGenerator,
  data() {
    return {
      zOut: 4
    };
  },
  methods: {
    generateGraph(positiveProbability: number) {
      const graph = girvanNewman(Graph, { zOut: this.zOut });
      assignOpinion(graph, positiveProbability);
      this.setGraph(graph);
    }
  }
});
</script>

<style scoped lang="scss">
.girvan-newman-generator {
  width: 100%;
}
</style>
