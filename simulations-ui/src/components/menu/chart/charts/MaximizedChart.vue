<template>
  <prime-dialog
    class="maximized-chart"
    v-model:visible="visible"
    :modal="true"
    :dismissableMask="true"
    @hide="onHide"
    @show="onShow"
  >
    <div class="maximized-chart-content">
      <component v-if="isMaximized" :is="chartComponent"></component>
    </div>
  </prime-dialog>
</template>

<script setup lang="ts">
import { computed, DefineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import PrimeDialog from 'primevue/dialog';
import { useChartStore } from '@/stores/chart.store';
import { useDialog } from '@/composables/useDialog';
import { ChartName } from '@/composables/useChart';
import AverageOpinionChart from '@/components/menu/chart/charts/AverageOpinionChart.vue';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', modelValue: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const chartStore = useChartStore();
const { isMaximized, maximized } = storeToRefs(chartStore);
const { visible, onShow, onHide } = useDialog(props, emit);

const chartNameToComponentMap = new Map([['average-opinion-chart', AverageOpinionChart]]) as Map<
  ChartName,
  DefineComponent
>;

const chartComponent = computed(() => {
  if (maximized?.value) {
    return chartNameToComponentMap.get(maximized.value.chartName);
  }
  return undefined;
});
</script>

<style scoped lang="scss">
.maximized-chart {
  &-content {
    max-height: 85vh;
    width: 80vw;
    padding: 1rem;
  }
}
</style>

<style lang="scss">
.maximized-chart.p-dialog {
  .p-dialog-header {
    padding: 0.5rem 0.5rem 0 0;

    :hover {
      cursor: pointer;
    }

    .maximized-chart-header-icons {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      column-gap: 1rem;
      text-align: center;
      align-content: center;
      align-items: center;
      width: 100%;
      margin-left: 1rem;
    }

    .p-dialog-header-icons {
      display: flex;
      flex-direction: row-reverse;
      width: 100%;
    }
  }

  .p-dialog-content {
    padding: 0;
  }
}
</style>
