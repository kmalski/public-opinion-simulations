<template>
  <div class="graph-speeddial">
    <speed-dial
      :model="items"
      direction="right"
      showIcon="pi pi-bars"
      hideIcon="pi pi-times"
      buttonClass="p-button-outlined"
      :tooltipOptions="{ position: 'top', event: 'hover' }"
      :hideOnClickOutside="false"
    />
    <graph-download v-model="downloadVisible"></graph-download>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PrimeIcons, ToastSeverity } from 'primevue/api';
import { mapActions, mapState } from 'pinia';
import { useGraphStore } from '@/stores/graph.store';
import { saveAsPng } from '@/helpers/download';
import { Sigma } from 'sigma';
import SpeedDial from '@/components/primevue/SpeedDial.vue';
import GraphDownload from '@/components/graph/GraphDownload.vue';

export default defineComponent({
  name: 'GraphSpeedDial',
  components: { GraphDownload, SpeedDial },
  data() {
    return {
      downloadVisible: false,
      items: [
        {
          label: 'Start layout',
          icon: PrimeIcons.PLAY,
          command: () => this.startLayout()
        },
        {
          label: 'Random layout',
          icon: PrimeIcons.REPLAY,
          command: () => this.randomLayout()
        },
        {
          label: 'Center',
          icon: PrimeIcons.CIRCLE_FILL,
          command: () => this.centerLayout()
        },
        {
          label: 'Download as image',
          icon: PrimeIcons.IMAGE,
          command: () => this.downloadImage()
        },
        {
          label: 'Download graph',
          icon: PrimeIcons.DOWNLOAD,
          command: () => this.downloadGraph()
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
  computed: {
    ...mapState(useGraphStore, ['isLayoutRunning', 'sigma', 'graph'])
  },
  watch: {
    isLayoutRunning(newIsLayoutRunning) {
      const item = this.items[0];
      item.label = newIsLayoutRunning ? 'Stop layout' : 'Start layout';
      item.icon = newIsLayoutRunning ? PrimeIcons.STOP : PrimeIcons.PLAY;
      item.command = newIsLayoutRunning ? this.stopLayout : this.startLayout;
    }
  },
  methods: {
    ...mapActions(useGraphStore, ['startLayout', 'stopLayout', 'randomLayout', 'centerLayout']),
    toggleFullscreen(fullscreen: boolean) {
      const item = this.items[this.items.length - 1];
      item.label = fullscreen ? 'Minimize' : 'Maximize';
      item.icon = fullscreen ? PrimeIcons.WINDOW_MINIMIZE : PrimeIcons.WINDOW_MAXIMIZE;
    },
    downloadImage() {
      if (this.sigma) saveAsPng(this.sigma as Sigma);
      else
        this.$toast.add({
          severity: ToastSeverity.ERROR,
          summary: 'Download error',
          detail: 'Can not save graph as image, because it is not initialized',
          life: 10000
        });
    },
    downloadGraph() {
      this.downloadVisible = true;
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

    .p-speeddial-action {
      text-decoration-line: none;
    }
  }
}
</style>
