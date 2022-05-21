import { acceptHMRUpdate, defineStore } from 'pinia';
import { Optional } from '@/helpers/types';
import { emptyFun } from '@/helpers/utils';
import { ChartName, StatisticName } from '@/composables/useChart';

interface Statistic {
  data: number[];
  labels: any[];
  update: () => void;
}

interface Maximized {
  chartName: ChartName;
}

interface State {
  stats: { [name: string]: Statistic };
  chartComponentsNames: ChartName[];
  isMaximized: boolean;
  maximized: Optional<Maximized>;
}

export const useChartStore = defineStore('chart', {
  state: (): State => ({
    stats: {},
    chartComponentsNames: [],
    isMaximized: false,
    maximized: undefined
  }),
  actions: {
    updateStatistic(name: StatisticName, value: number | number[], label: any) {
      const statistic = this.getStatistic(name);
      if (typeof value === 'number') {
        statistic.data.push(value);
        statistic.labels.push(label);
      } else {
        statistic.data.push(...value);
        statistic.labels.push(...label);
      }
      statistic.update();
    },
    clear(name: StatisticName) {
      const statistic = this.getStatistic(name);
      statistic.data.length = 0;
      statistic.labels.length = 0;
      statistic.update();
    },
    clearAll() {
      Object.keys(this.stats).forEach((name) => {
        const statistic = this.stats[name];
        statistic.data.length = 0;
        statistic.labels.length = 0;
        statistic.update();
      });
    },
    getStatistic(name: StatisticName): Statistic {
      let statistic = this.stats[name];
      if (!statistic) {
        statistic = {
          data: [],
          labels: [],
          update: emptyFun
        };
        this.stats[name] = statistic;
      }
      return statistic;
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChartStore, import.meta.hot));
}
