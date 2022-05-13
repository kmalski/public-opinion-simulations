<template>
  <div class="graph-generator-form">
    <span v-if="generatorName" class="p-float-label">
      <input-number
        id="positiveProbability"
        v-model="positiveProbability"
        mode="decimal"
        :min="0"
        :max="1"
        :max-fraction-digits="2"
      ></input-number>
      <label for="positiveProbability">Probability of positive opinion</label>
    </span>
    <p v-if="!generatorName" class="graph-generator-form-hint">
      The parameters will be available after selecting generator
    </p>
    <component v-if="generatorName" :is="generator"></component>
  </div>
</template>

<script setup lang="ts">
import { computed, DefineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useGeneratorStore } from '@/stores/generator.store';
import { GeneratorName } from '@/composables/useGenerator';
import CompleteGenerator from '@/components/menu/graph/generators/CompleteGenerator.vue';
import EmptyGenerator from '@/components/menu/graph/generators/EmptyGenerator.vue';
import LadderGenerator from '@/components/menu/graph/generators/LadderGenerator.vue';
import PathGenerator from '@/components/menu/graph/generators/PathGenerator.vue';
import RegularSquareGenerator from '@/components/menu/graph/generators/RegularSquareGenerator.vue';
import RegularTriangularGenerator from '@/components/menu/graph/generators/RegularTriangularGenerator.vue';
import CavemanGenerator from '@/components/menu/graph/generators/CavemanGenerator.vue';
import ConnectedCavemanGenerator from '@/components/menu/graph/generators/ConnectedCavemanGenerator.vue';
import ClustersGenerator from '@/components/menu/graph/generators/ClustersGenerator.vue';
import ErdosRenyiGenerator from '@/components/menu/graph/generators/ErdosRenyiGenerator.vue';
import GirvanNewmanGenerator from '@/components/menu/graph/generators/GirvanNewmanGenerator.vue';
import KrackhardtKiteGenerator from '@/components/menu/graph/generators/KrackhardtKiteGenerator.vue';
import FlorentineFamiliesGenerator from '@/components/menu/graph/generators/FlorentineFamiliesGenerator.vue';
import KarateClubGenerator from '@/components/menu/graph/generators/KarateClubGenerator.vue';

const nameToComponent = new Map([
  ['complete-generator', CompleteGenerator],
  ['empty-generator', EmptyGenerator],
  ['ladder-generator', LadderGenerator],
  ['path-generator', PathGenerator],
  ['regular-square-generator', RegularSquareGenerator],
  ['regular-triangular-generator', RegularTriangularGenerator],
  ['caveman-generator', CavemanGenerator],
  ['connected-caveman-generator', ConnectedCavemanGenerator],
  ['clusters-generator', ClustersGenerator],
  ['erdos-renyi-generator', ErdosRenyiGenerator],
  ['girvan-newman-generator', GirvanNewmanGenerator],
  ['krackhardt-kite-generator', KrackhardtKiteGenerator],
  ['florentine-families-generator', FlorentineFamiliesGenerator],
  ['karate-club-generator', KarateClubGenerator]
]) as Map<GeneratorName, DefineComponent>;

const generatorStore = useGeneratorStore();
const { positiveProbability, generatorName } = storeToRefs(generatorStore);

const generator = computed(() => {
  if (generatorName?.value) {
    return nameToComponent.get(generatorName.value);
  }
  return undefined;
});
</script>

<style scoped lang="scss">
@use '../../../styles/forms';
@use '../../../styles/variables';

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
    @include forms.hint;
  }
}
</style>
