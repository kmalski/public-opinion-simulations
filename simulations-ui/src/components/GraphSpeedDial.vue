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
import SpeedDial from '@/components/primevue/SpeedDial.vue';
import { mapActions, mapState } from 'pinia';
import { useGraphStore } from '@/stores/graph.store';

export default defineComponent({
  name: 'GraphSpeedDial',
  components: { SpeedDial },
  data() {
    return {
      items: [
        {
          label: 'Maximize',
          icon: PrimeIcons.WINDOW_MAXIMIZE,
          command: async () => {
            await this.$fullscreen.toggle(document.querySelector('.graph-card'), {
              teleport: true,
              callback: (fullscreen) => this.toggleFullscreen(fullscreen)
            });
          }
        },
        {
          label: 'Download',
          icon: PrimeIcons.DOWNLOAD,
          command: () => {
            console.log('Download');
          }
        },
        {
          label: 'Center',
          icon: PrimeIcons.MAP_MARKER,
          command: () => this.centerLayout()
        },
        {
          label: 'Start layout',
          icon: PrimeIcons.PLAY,
          command: () => this.startLayout()
        }
      ]
    };
  },
  computed: {
    ...mapState(useGraphStore, ['isLayoutRunning'])
  },
  watch: {
    isLayoutRunning(newIsLayoutRunning) {
      const item = this.items[3];
      item.label = newIsLayoutRunning ? 'Stop layout' : 'Start layout';
      item.icon = newIsLayoutRunning ? PrimeIcons.STOP : PrimeIcons.PLAY;
      item.command = newIsLayoutRunning ? this.stopLayout : this.startLayout;
    }
  },
  methods: {
    ...mapActions(useGraphStore, ['startLayout', 'stopLayout', 'centerLayout']),
    toggleFullscreen(fullscreen: boolean) {
      const item = this.items[0];
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
