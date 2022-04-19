<template>
  <div class="graph-tab">
    <graph-upload></graph-upload>
    <divider></divider>
    <p class="graph-tab-hint">Enter the graph parameters</p>
    <graph-generator-dropdown></graph-generator-dropdown>
    <graph-generating></graph-generating>
    <prime-button
      :disabled="!generator"
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
    ...mapState(useGeneratorStore, ['generator'])
  },
  methods: {
    ...mapActions(useGeneratorStore, ['generateGraph'])
  }
});
</script>

<style scoped lang="scss">
.graph-tab {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: center;
  height: 100%;
  max-height: 100%;

  &-hint {
    width: 90%;
    margin: auto;
    text-align: left;
  }

  &-button {
    justify-self: flex-end;
    margin: 2rem auto 0 auto;
    width: 90%;
    overflow: visible;
  }

  .p-dropdown {
    width: 90%;
    margin: 1rem auto;
  }
}
</style>
