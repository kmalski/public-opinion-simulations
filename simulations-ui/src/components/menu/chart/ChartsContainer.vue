<template>
  <div class="charts-container">
    <p v-if="chartComponentsNames.length === 0" class="charts-container-hint">
      Please select one of the available charts
    </p>
    <component v-for="chart in chartComponentsNames" :key="chart" :is="getChartComponent(chart)"></component>
  </div>
</template>

<script setup lang="ts">
import { DefineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useChartStore } from '@/stores/chart.store';
import { ChartName } from '@/composables/useChart';
import AverageOpinionChart from '@/components/menu/chart/charts/AverageOpinionChart.vue';

const chartStore = useChartStore();
const { chartComponentsNames } = storeToRefs(chartStore);

const nameToComponent = new Map([[ChartName.AVERAGE_OPINION_CHART, AverageOpinionChart]]) as Map<
  ChartName,
  DefineComponent
>;

function getChartComponent(name: ChartName) {
  return nameToComponent.get(name);
}
</script>

<style scoped lang="scss">
@use '../../../styles/forms';

.charts-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: flex-start;
  row-gap: 1rem;
  width: 90%;
  height: 100%;
  overflow: auto;

  &-hint {
    @include forms.hint;
  }
}
</style>
