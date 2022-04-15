<template>
  <div class="ladder-generator">
    <span class="p-float-label">
      <input-number id="ladderLength" v-model="ladderLength"></input-number>
      <label for="ladderLength">Length of the ladder</label>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ladder from 'graphology-generators/classic/ladder';
import { Graph } from '@/helpers/types';
import { assignOpinion } from '@/helpers/parser';
import GraphGenerator from '@/components/menu/graph/generator/GraphGenerator.vue';

export default defineComponent({
  name: 'LadderGenerator',
  extends: GraphGenerator,
  data() {
    return {
      ladderLength: 10
    };
  },
  methods: {
    generateGraph(positiveProbability: number) {
      const graph = ladder(Graph, this.ladderLength);
      assignOpinion(graph, positiveProbability);
      this.setGraph(graph);
    }
  }
});
</script>

<style scoped lang="scss">
.ladder-generator {
  width: 100%;
}
</style>
