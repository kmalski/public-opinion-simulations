import Chart from 'primevue/chart';
import { Chart as ChartJS } from 'chart.js';
import { useChartStore } from '@/stores/chart.store';
import { Color } from '@/helpers/types';
import { Ref, toRaw, watch } from 'vue';
import { saveUrl } from '@/helpers/download';
import { storeToRefs } from 'pinia';

export interface ChartOptions {
  borderColor: Color;
  xAxisTitle: string;
  yAxisTitle: string;
}

export enum ChartName {
  AVERAGE_OPINION_CHART = 'average-opinion-chart'
}

export enum StatisticName {
  AVERAGE_OPINION = 'average-opinion'
}

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
        tension: 0.2,
        borderColor: chartOptions.borderColor,
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  };

  const options = {
    normalized: true,
    animation: false,
    hover: {
      mode: 'nearest',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: true
      },
      zoom: {
        limits: {
          x: { min: 'original', max: 'original' },
          y: { min: 'original', max: 'original' }
        },
        zoom: {
          wheel: {
            enabled: true
          },
          pinch: {
            enabled: true
          },
          mode: 'xy'
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: chartOptions.xAxisTitle
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        title: {
          display: true,
          text: chartOptions.yAxisTitle
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  const onClear = () => chartStore.clear(statisticName);

  const onDownload = () => {
    if (chart.value) {
      const chartjs = chart.value?.getChart() as ChartJS;
      const url = chartjs.toBase64Image('image/jpeg', 1);
      saveUrl(url, statisticName);
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
