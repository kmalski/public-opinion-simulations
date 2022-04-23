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

<script setup lang="ts">
import { PrimeIcons } from 'primevue/api';
import GraphTab from '@/components/menu/graph/GraphTab.vue';
import ChartsTab from '@/components/menu/charts/ChartsTab.vue';
import SimulationTab from '@/components/menu/simulation/SimulationTab.vue';

const tabs = [
  {
    title: 'Simulation',
    icon: PrimeIcons.PLAY,
    item: SimulationTab
  },
  {
    title: 'Graph',
    icon: PrimeIcons.SITEMAP,
    item: GraphTab
  },
  {
    title: 'Charts',
    icon: PrimeIcons.CHART_LINE,
    item: ChartsTab
  }
];
</script>

<style scoped lang="scss">
@use '../../styles/variables';

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
      height: 100%;
      max-height: 100%;
      position: relative;

      .p-card-content {
        padding: 0 1rem;
        height: 100%;
        max-height: 100%;
        position: relative;

        .p-tabview {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: 100%;
          position: relative;

          .p-tabview-panels {
            padding: 1rem 0;
            height: 100%;
            max-height: 100%;
            position: relative;
            overflow: hidden;

            .p-tabview-panel {
              height: 100%;
              max-height: 100%;
              position: relative;
            }

            .p-divider.p-divider-horizontal:before {
              border-top: 2px solid variables.$divider-color;
            }
          }
        }
      }
    }
  }
}
</style>
