<template>
  <div class="graph-tab">
    <graph-upload></graph-upload>
    <divider></divider>
    <p class="graph-tab-generator-hint">Enter the graph parameters</p>
    <graph-generator-dropdown @change="onGeneratorChange"></graph-generator-dropdown>
    <component v-if="currentGenerator !== ''" ref="generator" :is="currentGenerator"></component>
    <classic-button class="graph-tab-generator-button" label="Generate" @click="generateGraph"></classic-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GraphUpload from '@/components/menu/graph/GraphUpload.vue';
import GraphGeneratorDropdown from '@/components/menu/graph/GraphGeneratorDropdown.vue';
import CavemanGenerator from '@/components/menu/graph/generator/CavemanGenerator.vue';
import ConnectedCavemanGenerator from '@/components/menu/graph/generator/ConnectedCavemanGenerator.vue';

export default defineComponent({
  name: 'GraphTab',
  components: { GraphUpload, GraphGeneratorDropdown, CavemanGenerator, ConnectedCavemanGenerator },
  data() {
    return {
      currentGenerator: ''
    };
  },
  methods: {
    onGeneratorChange(generator: string) {
      this.currentGenerator = generator;
    },
    generateGraph() {
      this.$refs.generator.generateGraph();
    }
  }
});
</script>

<style scoped lang="scss">
.graph-tab {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  height: 100%;

  &-generator-hint {
    margin: 0 0 1rem;
    text-align: left;
    width: 90%;
  }

  &-generator-button {
    width: 90%;
    justify-self: flex-end;
    margin: 2rem 0;
  }
}
</style>
