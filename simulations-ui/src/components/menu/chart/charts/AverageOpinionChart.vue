<template>
  <div class="average-opinion-chart">
    <chart type="line" :data="data" :options="options" :plugins="plugins" ref="chartComponent" />
    <chart-control-buttons
      :on-clear="onClear"
      :on-download="onDownload"
      :on-maximize="onMaximize"
    ></chart-control-buttons>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Chart from 'primevue/chart';
import { ChartName, StatisticName, useChart } from '@/composables/useChart';
import ChartControlButtons from '@/components/menu/chart/charts/ChartControlButtons.vue';

const chartComponent = ref<Chart | null>(null);

const { data, options, plugins, onClear, onDownload, onMaximize } = useChart(
  StatisticName.AVERAGE_OPINION,
  ChartName.AVERAGE_OPINION_CHART,
  chartComponent,
  {
    borderColor: '#42A5F5',
    xAxisTitle: 'Simulation step',
    yAxisTitle: 'Average opinion'
  }
);
</script>

<style scoped lang="scss">
@use '../../../../styles/variables';
@use '../../../../styles/tab';

.average-opinion-chart {
  @include tab.chart;
}
</style>
