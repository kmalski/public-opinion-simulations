<template>
  <dropdown
    class="graph-generator-dropdown"
    v-model="selectedGenerator"
    @change="onChange"
    :options="options"
    option-label="name"
    placeholder="Select Generator"
  ></dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Option {
  name: string;
  generator: string;
}

export default defineComponent({
  name: 'GraphGeneratorDropdown',
  emits: ['change'],
  data() {
    return {
      options: [
        { name: 'Complete', generator: '' },
        { name: 'Empty', generator: '' },
        { name: 'Ladder', generator: '' },
        { name: 'Path', generator: '' },
        { name: 'Regular', generator: '' },
        { name: 'Caveman', generator: 'caveman-generator' },
        { name: 'Connected Caveman', generator: 'connected-caveman-generator' },
        { name: 'Clusters', generator: '' },
        { name: 'Erdos-Renyi', generator: '' },
        { name: 'Girvan-Newman', generator: '' }
      ],
      selectedGenerator: null
    };
  },
  methods: {
    onChange(event: { value: Option }) {
      this.$emit('change', event.value.generator);
    }
  }
});
</script>

<style scoped lang="scss">
.graph-generator-dropdown {
  width: 90%;
}
</style>
