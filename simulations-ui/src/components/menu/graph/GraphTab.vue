<template>
  <div class="graph-tab">
    <graph-upload></graph-upload>
    <divider></divider>
    <p class="graph-tab-hint">Enter the graph parameters</p>
    <graph-generator-dropdown class="graph-tab-dropdown"></graph-generator-dropdown>
    <graph-generating></graph-generating>
    <prime-button
      :disabled="!generatorComponent"
      class="graph-tab-button"
      label="Generate"
      @click="generateGraph"
    ></prime-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useGeneratorStore } from '@/stores/generator.store';
import GraphUpload from '@/components/menu/graph/GraphUpload.vue';
import GraphGeneratorDropdown from '@/components/menu/graph/GraphGeneratorDropdown.vue';
import GraphGenerating from '@/components/menu/graph/GraphGenerating.vue';

export default defineComponent({
  name: 'GraphTab',
  components: {
    GraphUpload,
    GraphGeneratorDropdown,
    GraphGenerating
  },
  computed: {
    ...mapState(useGeneratorStore, ['generatorComponent'])
  },
  methods: {
    ...mapActions(useGeneratorStore, ['generateGraph'])
  }
});
</script>

<style scoped lang="scss">
@use '../../../styles/tab';

.graph-tab {
  @include tab.tab;
}
</style>
