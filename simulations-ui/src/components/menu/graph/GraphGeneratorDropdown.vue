<template>
  <dropdown
    class="graph-generator-dropdown"
    v-model="selectedOption"
    :options="options"
    option-label="label"
    placeholder="Select Generator"
  ></dropdown>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGeneratorStore } from '@/stores/generator.store';
import { GeneratorName } from '@/composables/useGenerator';

interface Option {
  label: string;
  generator: GeneratorName;
}

const generatorStore = useGeneratorStore();
const selectedOption = ref<Option | null>(null);
const options = ref<Option[]>([
  { label: 'Complete', generator: GeneratorName.COMPLETE_GENERATOR },
  { label: 'Empty', generator: GeneratorName.EMPTY_GENERATOR },
  { label: 'Ladder', generator: GeneratorName.LADDER_GENERATOR },
  { label: 'Path', generator: GeneratorName.PATH_GENERATOR },
  { label: 'Regular Square', generator: GeneratorName.REGULAR_SQUARE_GENERATOR },
  { label: 'Regular Triangular', generator: GeneratorName.REGULAR_TRIANGULAR_GENERATOR },
  { label: 'Caveman', generator: GeneratorName.CAVEMAN_GENERATOR },
  { label: 'Connected Caveman', generator: GeneratorName.CONNECTED_CAVEMAN_GENERATOR },
  { label: 'Clusters', generator: GeneratorName.CLUSTERS_GENERATOR },
  { label: 'Erdos-Renyi', generator: GeneratorName.ERDOS_RENYI_GENERATOR },
  { label: 'Girvan-Newman', generator: GeneratorName.GIRVAN_NEWMAN_GENERATOR },
  { label: 'Krackhardt kite', generator: GeneratorName.KRACKHARDT_KITE_GENERATOR },
  { label: 'Florentine families’', generator: GeneratorName.FLORENTINE_FAMILIES_GENERATOR },
  { label: 'Zachary’s karate club', generator: GeneratorName.KARATE_CLUB_GENERATOR }
]);

watch(selectedOption, (newOption) => {
  generatorStore.generatorName = newOption?.generator;
});
</script>

<style scoped lang="scss">
.graph-generator-dropdown {
  width: 100%;
}
</style>
