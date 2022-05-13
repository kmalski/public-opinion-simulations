<template>
  <multi-select
    class="charts-multi-select"
    v-model="selectedCharts"
    :options="options"
    placeholder="Select charts"
    option-label="name"
    display="chip"
  ></multi-select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useChartStore } from '@/stores/chart.store';
import { ChartName } from '@/composables/useChart';

interface Option {
  name: string;
  chart: ChartName;
}

const chartStore = useChartStore();

const options = ref<Option[]>([{ name: 'Average Opinion', chart: 'average-opinion-chart' }]);
const selectedCharts = ref<Option[]>([...options.value]);

watch(
  selectedCharts,
  (newCharts) => {
    chartStore.chartComponentsNames = newCharts.map((option) => option.chart);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.charts-multi-select {
  width: 100%;

  :deep(.p-multiselect-label) {
    display: flex;
  }
}
</style>
