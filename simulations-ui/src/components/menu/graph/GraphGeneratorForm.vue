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
    <component v-if="generatorComponentName" :is="generator"></component>
  </div>
</template>

<script setup lang="ts">
import { computed, DefineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useGeneratorStore } from '@/stores/generator.store';
import CompleteGenerator from '@/components/menu/graph/generator/CompleteGenerator.vue';
import EmptyGenerator from '@/components/menu/graph/generator/EmptyGenerator.vue';
import LadderGenerator from '@/components/menu/graph/generator/LadderGenerator.vue';
import PathGenerator from '@/components/menu/graph/generator/PathGenerator.vue';
import RegularSquareGenerator from '@/components/menu/graph/generator/RegularSquareGenerator.vue';
import CavemanGenerator from '@/components/menu/graph/generator/CavemanGenerator.vue';
import ConnectedCavemanGenerator from '@/components/menu/graph/generator/ConnectedCavemanGenerator.vue';
import ClustersGenerator from '@/components/menu/graph/generator/ClustersGenerator.vue';
import ErdosRenyiGenerator from '@/components/menu/graph/generator/ErdosRenyiGenerator.vue';
import GirvanNewmanGenerator from '@/components/menu/graph/generator/GirvanNewmanGenerator.vue';
import KrackhardtKiteGenerator from '@/components/menu/graph/generator/KrackhardtKiteGenerator.vue';
import FlorentineFamiliesGenerator from '@/components/menu/graph/generator/FlorentineFamiliesGenerator.vue';
import KarateClubGenerator from '@/components/menu/graph/generator/KarateClubGenerator.vue';

const nameToComponent = new Map([
  ['complete-generator', CompleteGenerator],
  ['empty-generator', EmptyGenerator],
  ['ladder-generator', LadderGenerator],
  ['path-generator', PathGenerator],
  ['regular-square-generator', RegularSquareGenerator],
  ['caveman-generator', CavemanGenerator],
  ['connected-caveman-generator', ConnectedCavemanGenerator],
  ['clusters-generator', ClustersGenerator],
  ['erdos-renyi-generator', ErdosRenyiGenerator],
  ['girvan-newman-generator', GirvanNewmanGenerator],
  ['krackhardt-kite-generator', KrackhardtKiteGenerator],
  ['florentine-families-generator', FlorentineFamiliesGenerator],
  ['karate-club-generator', KarateClubGenerator]
]) as Map<string, DefineComponent>;

const generatorStore = useGeneratorStore();
const { positiveProbability, generatorComponentName } = storeToRefs(generatorStore);

const generator = computed(() => {
  if (generatorComponentName?.value) {
    return nameToComponent.get(generatorComponentName.value);
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
