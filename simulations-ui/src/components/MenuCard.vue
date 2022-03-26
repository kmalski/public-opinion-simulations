<template>
  <div class="menu-card">
    <card>
      <template #content>
        <tab-view>
          <tab-panel v-for="tab in tabs" :key="tab.title">
            <template #header>
              <i :class="`icon pi ${tab.icon}`"></i>
              <span>{{ tab.title }}</span>
            </template>
          </tab-panel>
        </tab-view>
      </template>
    </card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PrimeIcons } from 'primevue/api';

export default defineComponent({
  name: 'MenuCard',
  data() {
    return {
      tabs: [
        {
          title: 'Simulation',
          icon: PrimeIcons.PLAY
        },
        {
          title: 'Graph',
          icon: PrimeIcons.BOX
        },
        {
          title: 'Charts',
          icon: PrimeIcons.CHART_LINE
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
}

::v-deep(.p-card) {
  height: 100%;
  width: 100%;

  .p-card-content {
    padding-top: 0;
  }
}

.icon {
  margin-right: 10px;
}
</style>
