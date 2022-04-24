<template>
  <div class="graph-speeddial">
    <speed-dial
      :model="state.items"
      direction="right"
      showIcon="pi pi-bars"
      hideIcon="pi pi-times"
      buttonClass="p-button-outlined"
      :tooltipOptions="{ position: 'top', event: 'hover' }"
      :hideOnClickOutside="false"
    />
    <graph-download v-model="state.downloadVisible"></graph-download>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useGraphStore } from '@/stores/graph.store';
import { useToastStore } from '@/stores/toast.store';
import { saveAsPng } from '@/helpers/download';
import { Sigma } from 'sigma';
import { PrimeIcons } from 'primevue/api';
import { api as fullscreen } from 'vue-fullscreen';
import SpeedDial from '@/components/primevue/SpeedDial.vue';
import GraphDownload from '@/components/graph/GraphDownload.vue';

const toastStore = useToastStore();
const graphStore = useGraphStore();
const { isLayoutRunning, isHoveringEnabled } = storeToRefs(graphStore);

const state = reactive({
  downloadVisible: false,
  items: [
    {
      label: 'Start layout',
      icon: PrimeIcons.PLAY,
      command: () => graphStore.startLayout()
    },
    {
      label: 'Random layout',
      icon: PrimeIcons.REPLAY,
      command: () => graphStore.randomLayout()
    },
    {
      label: 'Center',
      icon: PrimeIcons.CIRCLE_FILL,
      command: () => graphStore.centerLayout()
    },
    {
      label: 'Enable highlighting',
      icon: PrimeIcons.FILTER,
      command: () => graphStore.enableHovering()
    },
    {
      label: 'Download as image',
      icon: PrimeIcons.IMAGE,
      command: () => downloadImage()
    },
    {
      label: 'Download graph',
      icon: PrimeIcons.DOWNLOAD,
      command: () => downloadGraph()
    },
    {
      label: 'Maximize',
      icon: PrimeIcons.WINDOW_MAXIMIZE,
      command: async () => {
        await fullscreen.toggle(document.querySelector('.graph-card'), {
          teleport: true,
          callback: (fullscreen) => toggleFullscreen(fullscreen)
        });
      }
    }
  ]
});

watch(isLayoutRunning, (newIsLayoutRunning) => {
  const item = state.items[0];
  item.label = (newIsLayoutRunning ? 'Stop' : 'Start') + ' layout';
  item.icon = newIsLayoutRunning ? PrimeIcons.STOP : PrimeIcons.PLAY;
  item.command = newIsLayoutRunning ? graphStore.stopLayout : graphStore.startLayout;
});

watch(isHoveringEnabled, (newIsHoveringEnabled) => {
  const item = state.items[3];
  item.label = (newIsHoveringEnabled ? 'Disable' : 'Enable') + ' highlighting';
  item.icon = newIsHoveringEnabled ? PrimeIcons.FILTER_SLASH : PrimeIcons.FILTER;
  item.command = newIsHoveringEnabled ? graphStore.disableHovering : graphStore.enableHovering;
});

function toggleFullscreen(fullscreen: boolean) {
  const item = state.items[state.items.length - 1];
  item.label = fullscreen ? 'Minimize' : 'Maximize';
  item.icon = fullscreen ? PrimeIcons.WINDOW_MINIMIZE : PrimeIcons.WINDOW_MAXIMIZE;
}

function downloadImage() {
  if (graphStore.renderer) saveAsPng(graphStore.renderer as Sigma);
  else
    toastStore.error = {
      summary: 'Download error',
      detail: 'Can not save graph as image, because it is not initialized'
    };
}

function downloadGraph() {
  state.downloadVisible = true;
}
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
