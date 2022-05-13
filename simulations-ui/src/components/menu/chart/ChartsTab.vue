<template>
  <div class="charts-tab">
    <charts-multi-select class="charts-tab-multi-select"></charts-multi-select>
    <charts-container></charts-container>
    <prime-button class="charts-tab-button" label="Clear all" @click="chartStore.clearAll"></prime-button>
    <maximized-chart v-model="isMaximized"></maximized-chart>
  </div>
</template>

<script setup lang="ts">
import ChartsContainer from '@/components/menu/chart/ChartsContainer.vue';
import { useChartStore } from '@/stores/chart.store';
import ChartsMultiSelect from '@/components/menu/chart/ChartsMultiSelect.vue';
import MaximizedChart from '@/components/menu/chart/charts/MaximizedChart.vue';
import { storeToRefs } from 'pinia';

const chartStore = useChartStore();
const { isMaximized } = storeToRefs(chartStore);
</script>

<style scoped lang="scss">
@use '../../../styles/tab';

.charts-tab {
  @include tab.tab;

  align-items: center;
}
</style>
