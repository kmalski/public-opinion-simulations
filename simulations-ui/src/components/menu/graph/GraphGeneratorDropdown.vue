<template>
  <dropdown
    class="graph-generator-dropdown"
    v-model="selectedGenerator"
    :options="options"
    option-label="name"
    placeholder="Select Generator"
  ></dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { useGeneratorStore } from '@/stores/generator.store';

export default defineComponent({
  name: 'GraphGeneratorDropdown',
  data() {
    return {
      options: [
        { name: 'Complete', generator: 'complete-generator' },
        { name: 'Empty', generator: 'empty-generator' },
        { name: 'Ladder', generator: 'ladder-generator' },
        { name: 'Path', generator: 'path-generator' },
        { name: 'Regular', generator: 'regular-generator' },
        { name: 'Caveman', generator: 'caveman-generator' },
        { name: 'Connected Caveman', generator: 'connected-caveman-generator' },
        { name: 'Clusters', generator: 'clusters-generator' },
        { name: 'Erdos-Renyi', generator: 'erdos-renyi-generator' },
        { name: 'Girvan-Newman', generator: 'girvan-newman-generator' }
      ],
      selectedGenerator: null
    };
  },
  watch: {
    selectedGenerator(newGenerator) {
      this.setGeneratorComponentName(newGenerator.generator);
    }
  },
  methods: {
    ...mapActions(useGeneratorStore, ['setGeneratorComponentName'])
  }
});
</script>

<style scoped lang="scss">
.graph-generator-dropdown {
  width: 100%;
}
</style>
