<template>
  <div class="graph-generating">
    <p class="graph-generating-hint">Enter the graph parameters</p>
    <graph-generator-dropdown @change="onGeneratorChange"></graph-generator-dropdown>
    <span v-if="currentGenerator" class="p-float-label">
      <input-number
        id="positiveProbability"
        v-model="positiveProbability"
        mode="decimal"
        :max-fraction-digits="2"
      ></input-number>
      <label for="positiveProbability">Probability of positive opinion</label>
    </span>
    <component v-if="currentGenerator" ref="generator" :is="currentGenerator"></component>
    <classic-button class="graph-generating-button" label="Generate" @click="generateGraph"></classic-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GraphUpload from '@/components/menu/graph/GraphUpload.vue';
import GraphGeneratorDropdown from '@/components/menu/graph/GraphGeneratorDropdown.vue';
import CompleteGenerator from '@/components/menu/graph/generator/CompleteGenerator.vue';
import EmptyGenerator from '@/components/menu/graph/generator/EmptyGenerator.vue';
import LadderGenerator from '@/components/menu/graph/generator/LadderGenerator.vue';
import PathGenerator from '@/components/menu/graph/generator/PathGenerator.vue';
import RegularGenerator from '@/components/menu/graph/generator/RegularGenerator.vue';
import CavemanGenerator from '@/components/menu/graph/generator/CavemanGenerator.vue';
import ConnectedCavemanGenerator from '@/components/menu/graph/generator/ConnectedCavemanGenerator.vue';
import ClustersGenerator from '@/components/menu/graph/generator/ClustersGenerator.vue';
import ErdosRenyiGenerator from '@/components/menu/graph/generator/ErdosRenyiGenerator.vue';
import GirvanNewmanGenerator from '@/components/menu/graph/generator/GirvanNewmanGenerator.vue';
import GraphGenerator from '@/components/menu/graph/generator/GraphGenerator.vue';

export default defineComponent({
  name: 'GraphGenerating',
  components: {
    GraphUpload,
    GraphGeneratorDropdown,
    CompleteGenerator,
    EmptyGenerator,
    LadderGenerator,
    PathGenerator,
    RegularGenerator,
    CavemanGenerator,
    ConnectedCavemanGenerator,
    ClustersGenerator,
    ErdosRenyiGenerator,
    GirvanNewmanGenerator
  },
  data() {
    return {
      positiveProbability: 0.5,
      currentGenerator: ''
    };
  },
  methods: {
    onGeneratorChange(generator: string) {
      this.currentGenerator = generator;
    },
    generateGraph() {
      (this.$refs.generator as typeof GraphGenerator).generateGraph(this.positiveProbability);
    }
  }
});
</script>

<style scoped lang="scss">
.graph-generating {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  height: 100%;
  width: 90%;

  &-hint {
    width: 100%;
    margin: 0 0 1rem;
    text-align: left;
  }

  &-button {
    justify-self: flex-end;
    margin-top: 2rem;
    width: 100%;
  }
}
</style>
