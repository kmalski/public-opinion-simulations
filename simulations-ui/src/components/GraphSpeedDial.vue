<template>
  <div class="graph-speeddial">
    <speed-dial
      :model="items"
      :radius="120"
      direction="up-right"
      type="quarter-circle"
      showIcon="pi pi-bars"
      hideIcon="pi pi-times"
      buttonClass="p-button-outlined"
      :tooltipOptions="{ position: 'right' }"
      :hideOnClickOutside="false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PrimeIcons } from 'primevue/api';

export default defineComponent({
  name: 'GraphSpeedDial',
  data() {
    return {
      items: [
        {
          label: 'Vue Website 1',
          icon: 'pi pi-external-link',
          command: () => {
            window.location.href = 'https://vuejs.org/';
          }
        },
        {
          label: 'Maximize',
          icon: PrimeIcons.WINDOW_MAXIMIZE,
          command: async () => {
            await this.$fullscreen.toggle(document.querySelector('.graph-card'), {
              teleport: true,
              callback: (fullscreen) => this.toggleFullscreen(fullscreen)
            });
          }
        }
      ]
    };
  },
  methods: {
    toggleFullscreen(fullscreen: boolean) {
      const item = this.items[this.items.length - 1];
      item.label = fullscreen ? 'Minimize' : 'Maximize';
      item.icon = fullscreen ? PrimeIcons.WINDOW_MINIMIZE : PrimeIcons.WINDOW_MAXIMIZE;
    }
  }
});
</script>

<style scoped lang="scss">
.graph-speeddial {
  :deep(.p-speeddial) {
    left: 10px;
    bottom: 10px;

    .p-speeddial-button {
      height: 50px;
      width: 50px;
    }
  }
}
</style>
