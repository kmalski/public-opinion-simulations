<template>
  <div class="chart-control-buttons">
    <prime-button
      v-tooltip.bottom="'Clear chart'"
      class="p-button-sm"
      :icon="PrimeIcons.TIMES"
      @click="props.onClear"
    ></prime-button>
    <prime-button
      v-tooltip.bottom="'Download as image'"
      class="p-button-sm"
      :icon="PrimeIcons.CAMERA"
      @click="props.onDownload"
    ></prime-button>
    <prime-button
      v-tooltip.bottom="'Maximize'"
      class="p-button-sm"
      :icon="PrimeIcons.WINDOW_MAXIMIZE"
      :disabled="isMaximized"
      @click="props.onMaximize"
    ></prime-button>
  </div>
</template>

<script setup lang="ts">
import { PrimeIcons } from 'primevue/api';
import Tooltip from 'primevue/tooltip';
import { useChartStore } from '@/stores/chart.store';
import { storeToRefs } from 'pinia';

interface Props {
  onClear: () => void;
  onDownload: () => void;
  onMaximize: () => void;
}

const props = defineProps<Props>();
const vTooltip = Tooltip;

const chartStore = useChartStore();
const { isMaximized } = storeToRefs(chartStore);
</script>

<style scoped lang="scss">
.chart-control-buttons {
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;

  .p-button-sm {
    font-size: 0.5rem;
    width: 1rem;
  }
}
</style>
