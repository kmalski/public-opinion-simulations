<template>
  <div class="graph-card">
    <card>
      <template #content>
        <graph-container></graph-container>
        <graph-manipulation-speed-dial></graph-manipulation-speed-dial>
        <graph-utils-speed-dial></graph-utils-speed-dial>
      </template>
    </card>
  </div>
</template>

<script setup lang="ts">
import GraphContainer from '@/components/graph/GraphContainer.vue';
import GraphManipulationSpeedDial from '@/components/graph/GraphManipulationSpeedDial.vue';
import GraphUtilsSpeedDial from '@/components/graph/GraphUtilsSpeedDial.vue';
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
