<template>
  <div class="menu-card">
    <card>
      <template #content>
        <tab-view>
          <tab-panel v-for="tab in tabs" :key="tab.title">
            <template #header>
              <i :class="`menu-card-icon pi ${tab.icon}`"></i>
              <span>{{ tab.title }}</span>
            </template>
            <component :is="tab.item"></component>
          </tab-panel>
        </tab-view>
      </template>
    </card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PrimeIcons } from 'primevue/api';
import GraphTab from '@/components/menu/graph/GraphTab.vue';
import ChartsTab from '@/components/menu/charts/ChartsTab.vue';
import SimulationTab from '@/components/menu/simulation/SimulationTab.vue';

export default defineComponent({
  name: 'MenuCard',
  components: { ChartsTab, GraphTab, SimulationTab },
  data() {
    return {
      tabs: [
        {
          title: 'Simulation',
          icon: PrimeIcons.PLAY,
          item: 'simulation-tab'
        },
        {
          title: 'Graph',
          icon: PrimeIcons.SITEMAP,
          item: 'graph-tab'
        },
        {
          title: 'Charts',
          icon: PrimeIcons.CHART_LINE,
          item: 'charts-tab'
        }
      ]
    };
  }
});
</script>

<style scoped lang="scss">
.menu-card {
  height: 100%;
  width: 100%;
  max-height: calc(100vh - 2rem);

  &-icon {
    margin-right: 10px;
  }

  :deep(.p-card) {
    height: 100%;
    max-height: 100%;
    width: 100%;

    .p-card-body {
      padding: 0;

      .p-card-content {
        padding: 0 1rem;

        .p-tabview-panels {
          padding: 1rem 0;

          .p-divider.p-divider-horizontal:before {
            border-top: 2px solid #dee2e6;
          }
        }
      }
    }
  }
}
</style>
