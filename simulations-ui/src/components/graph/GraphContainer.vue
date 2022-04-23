<template>
  <div class="graph-container" ref="graphContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useGraphStore } from '@/stores/graph.store';

const graphStore = useGraphStore();
const { graph, isHoveringEnabled } = storeToRefs(graphStore);
const graphContainer = ref<HTMLDivElement | null>(null);

const refreshRenderer = () => {
  if (graphContainer.value) graphStore.setSigma(graphContainer.value);
};

watch(graph, () => {
  refreshRenderer();
  if (isHoveringEnabled) graphStore.enableHovering();
});

onMounted(() => {
  if (graphContainer.value) graphStore.setSigma(graphContainer.value);
});
</script>

<style scoped lang="scss">
.graph-container {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
