import Chart from 'primevue/chart';
import { Chart as ChartJS } from 'chart.js';
import { useChartStore } from '@/stores/chart.store';
import { Color } from '@/helpers/types';
import { Ref, toRaw, watch } from 'vue';
import { saveUrl } from '@/helpers/download';
import { storeToRefs } from 'pinia';

const TENSION = 0.3;
const GRID_COLOR = '#ebedef';
const TICK_COLOR = '#495057';

export interface ChartOptions {
  borderColor: Color;
  xAxisTitle: string;
  yAxisTitle: string;
}

export type ChartName = 'average-opinion-chart';

export type StatisticName = 'average-opinion';

export function useChart(
  statisticName: StatisticName,
  chartName: ChartName,
  chart: Ref<Chart | null>,
  chartOptions: ChartOptions
) {
  const chartStore = useChartStore();
  const statistic = chartStore.getStatistic(statisticName);
  const { isMaximized } = storeToRefs(chartStore);

  const plugins = [
    {
      id: 'custom_canvas_background_color',
      beforeDraw: (chart: any) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    }
  ];

  statistic.update = () => chart.value?.refresh();

  const data = {
    labels: toRaw(statistic.labels),
    datasets: [
      {
        data: toRaw(statistic.data),
        tension: TENSION,
        borderColor: chartOptions.borderColor
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: chartOptions.xAxisTitle
        },
        ticks: {
          color: TICK_COLOR
        },
        grid: {
          color: GRID_COLOR
        }
      },
      y: {
        title: {
          display: true,
          text: chartOptions.yAxisTitle
        },
        ticks: {
          color: TICK_COLOR
        },
        grid: {
          color: GRID_COLOR
        }
      }
    }
  };

  const onClear = () => chartStore.clear(statisticName);

  const onDownload = () => {
    if (chart.value) {
      const chartjs = chart.value?.getChart() as ChartJS;
      const url = chartjs.toBase64Image('image/jpeg', 1);
      saveUrl(url, statisticName + 'jpg');
    }
  };

  const onMaximize = () => {
    chartStore.maximized = { chartName };
    chartStore.isMaximized = true;
  };

  // restore updates to this instance after minimalization
  watch(isMaximized, (newIsMaximized) => {
    if (!newIsMaximized) {
      statistic.update = () => chart.value?.refresh();
    }
  });

  return { data, options, plugins, onClear, onDownload, onMaximize };
}
