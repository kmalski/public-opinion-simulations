<template>
  <div class="graph-tab">
    <graph-upload></graph-upload>
    <divider></divider>
    <graph-generating></graph-generating>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GraphUpload from '@/components/menu/graph/GraphUpload.vue';
import GraphGenerating from '@/components/menu/graph/GraphGenerating.vue';

export default defineComponent({
  name: 'GraphTab',
  components: {
    GraphUpload,
    GraphGenerating
  }
});
</script>

<style scoped lang="scss">
.graph-tab {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
}
</style>
