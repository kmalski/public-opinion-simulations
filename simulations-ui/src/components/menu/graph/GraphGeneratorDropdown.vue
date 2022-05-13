<template>
  <dropdown
    class="graph-generator-dropdown"
    v-model="selectedGenerator"
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
const selectedGenerator = ref<Option | null>(null);
const options = ref<Option[]>([
  { label: 'Complete', generator: 'complete-generator' },
  { label: 'Empty', generator: 'empty-generator' },
  { label: 'Ladder', generator: 'ladder-generator' },
  { label: 'Path', generator: 'path-generator' },
  { label: 'Regular Square', generator: 'regular-square-generator' },
  { label: 'Regular Triangular', generator: 'regular-triangular-generator' },
  { label: 'Caveman', generator: 'caveman-generator' },
  { label: 'Connected Caveman', generator: 'connected-caveman-generator' },
  { label: 'Clusters', generator: 'clusters-generator' },
  { label: 'Erdos-Renyi', generator: 'erdos-renyi-generator' },
  { label: 'Girvan-Newman', generator: 'girvan-newman-generator' },
  { label: 'Krackhardt kite', generator: 'krackhardt-kite-generator' },
  { label: 'Florentine families’', generator: 'florentine-families-generator' },
  { label: 'Zachary’s karate club', generator: 'karate-club-generator' }
]);

watch(selectedGenerator, (newGenerator) => {
  generatorStore.generatorName = newGenerator?.generator;
});
</script>

<style scoped lang="scss">
.graph-generator-dropdown {
  width: 100%;
}
</style>
