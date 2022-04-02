<template>
  <div class="graph-card">
    <card>
      <template #content>
        <graph-container></graph-container>
        <graph-speed-dial></graph-speed-dial>
      </template>
    </card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GraphContainer from '@/components/GraphContainer.vue';
import GraphSpeedDial from '@/components/GraphSpeedDial.vue';

export default defineComponent({
  name: 'GraphCard',
  components: { GraphSpeedDial, GraphContainer }
});
</script>

<style scoped lang="scss">
.graph-card {
  position: relative;
  height: 100%;
  width: 100%;

  :deep(.p-card) {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;

    .p-card-body {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;

      .p-card-content {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
      }
    }
  }
}
</style>
