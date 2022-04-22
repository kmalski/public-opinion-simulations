<template>
  <div class="graph-generator-form">
    <span v-if="generatorComponentName" class="p-float-label">
      <input-number
        id="positiveProbability"
        v-model="positiveProbability"
        mode="decimal"
        :max-fraction-digits="2"
      ></input-number>
      <label for="positiveProbability">Probability of positive opinion</label>
    </span>
    <p v-if="!generatorComponentName" class="graph-generator-form-hint">
      The parameters will be available after selecting generator
    </p>
    <component v-if="generatorComponentName" :is="generatorComponentName"></component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useGeneratorStore } from '@/stores/generator.store';
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

export default defineComponent({
  name: 'GraphGeneratorForm',
  components: {
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
      positiveProbability: 0.5
    };
  },
  watch: {
    positiveProbability(newProbability) {
      this.setPositiveProbability(newProbability);
    }
  },
  computed: {
    ...mapState(useGeneratorStore, ['generatorComponentName'])
  },
  methods: {
    ...mapActions(useGeneratorStore, ['setPositiveProbability'])
  }
});
</script>

<style scoped lang="scss">
@use '../../../styles/forms';

.graph-generator-form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  height: 100%;
  width: 90%;
  margin: 0 auto;
  overflow: auto;

  &-hint {
    width: 100%;
    margin: 0;
    text-align: left;
  }
}
</style>
