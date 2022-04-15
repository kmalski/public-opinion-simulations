<template>
  <div class="regular-generator">
    <span class="p-float-label">
      <input-number id="nodesNumber" v-model="nodesNumber"></input-number>
      <label for="nodesNumber">Number of nodes</label>
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
      componentsNumber: 3,
      nodesNumber: 10
    };
  },
  methods: {
    generateGraph(positiveProbability: number) {
      // TODO: implement
    }
  }
});
</script>

<style scoped lang="scss">
.regular-generator {
  width: 100%;
}
</style>
