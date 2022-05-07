<template>
  <div class="graph-utils-speeddial">
    <speed-dial
      :model="state.items"
      direction="up"
      showIcon="pi pi-inbox"
      hideIcon="pi pi-times"
      buttonClass="p-button"
      :tooltipOptions="{ position: 'right', event: 'hover' }"
      :hideOnClickOutside="false"
    />
    <graph-download v-model="state.downloadVisible"></graph-download>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useGraphStore } from '@/stores/graph.store';
import { useToastStore } from '@/stores/toast.store';
import { saveAsPng } from '@/helpers/download';
import { Sigma } from 'sigma';
import { PrimeIcons } from 'primevue/api';
import SpeedDial from '@/components/primevue/SpeedDial.vue';
import GraphDownload from '@/components/graph/GraphDownload.vue';

const toastStore = useToastStore();
const graphStore = useGraphStore();

const state = reactive({
  downloadVisible: false,
  items: [
    {
      label: 'Save graph backup',
      icon: PrimeIcons.CLONE,
      command: () => graphStore.backupGraph()
    },
    {
      label: 'Restore graph backup',
      icon: PrimeIcons.HISTORY,
      command: () => graphStore.restoreToBackup()
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
    }
  ]
});

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
.graph-utils-speeddial {
  :deep(.p-speeddial) {
    left: calc(4rem + 10px);
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
