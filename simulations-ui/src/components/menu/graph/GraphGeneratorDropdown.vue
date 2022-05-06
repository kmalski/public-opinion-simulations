<template>
  <dropdown
    class="graph-generator-dropdown"
    v-model="selectedGenerator"
    :options="options"
    option-label="name"
    placeholder="Select Generator"
  ></dropdown>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGeneratorStore } from '@/stores/generator.store';

interface Option {
  name: string;
  generator: string;
}

const generatorStore = useGeneratorStore();
const selectedGenerator = ref<Option | null>(null);
const options = ref([
  { name: 'Complete', generator: 'complete-generator' },
  { name: 'Empty', generator: 'empty-generator' },
  { name: 'Ladder', generator: 'ladder-generator' },
  { name: 'Path', generator: 'path-generator' },
  { name: 'Regular Square', generator: 'regular-square-generator' },
  { name: 'Caveman', generator: 'caveman-generator' },
  { name: 'Connected Caveman', generator: 'connected-caveman-generator' },
  { name: 'Clusters', generator: 'clusters-generator' },
  { name: 'Erdos-Renyi', generator: 'erdos-renyi-generator' },
  { name: 'Girvan-Newman', generator: 'girvan-newman-generator' },
  { name: 'Krackhardt kite', generator: 'krackhardt-kite-generator' },
  { name: 'Florentine families’', generator: 'florentine-families-generator' },
  { name: 'Zachary’s karate club', generator: 'karate-club-generator' }
]);

watch(selectedGenerator, (newGenerator) => {
  generatorStore.generatorComponentName = newGenerator?.generator;
});
</script>

<style scoped lang="scss">
.graph-generator-dropdown {
  width: 100%;
}
</style>
