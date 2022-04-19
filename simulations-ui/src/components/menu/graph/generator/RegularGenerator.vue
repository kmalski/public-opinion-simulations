<template>
  <div class="graph-generator regular-generator">
    <span class="p-float-label">
      <input-number id="nodesDegree" v-model="nodesDegree"></input-number>
      <label for="nodesDegree">Degree of each node</label>
    </span>

    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
    </span>

    <span class="form-input">
      <label class="form-input-label" for="periodicBoundary">Periodic boundaries</label>
      <input-switch id="periodicBoundary" v-model="periodicBoundary"></input-switch>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GraphGenerator from '@/components/menu/graph/generator/GraphGenerator.vue';

export default defineComponent({
  name: 'RegularGenerator',
  extends: GraphGenerator,
  data() {
    return {
      nodesDegree: 3,
      nodesNumber: 10,
      periodicBoundary: false
    };
  },
  methods: {
    generateGraph(positiveProbability: number) {
      //
    }
  }
});
</script>

<style scoped lang="scss">
@use '../../../../styles/forms';

.regular-generator {
  @include forms.graph-generator;
}
</style>
