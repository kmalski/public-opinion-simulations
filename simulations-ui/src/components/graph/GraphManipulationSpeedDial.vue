<template>
  <div class="graph-manipulation-speeddial">
    <speed-dial
      :model="state.items"
      direction="up"
      showIcon="pi pi-bars"
      hideIcon="pi pi-times"
      buttonClass="p-button"
      :tooltipOptions="{ position: 'right', event: 'hover' }"
      :hideOnClickOutside="false"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useGraphStore } from '@/stores/graph.store';
import { PrimeIcons } from 'primevue/api';
import { api as fullscreen } from 'vue-fullscreen';
import SpeedDial from '@/components/primevue/SpeedDial.vue';

const graphStore = useGraphStore();
const { isLayoutRunning, isHoveringEnabled, isDragAndDropEnabled, isOpinionChangeEnabled } = storeToRefs(graphStore);

const state = reactive({
  downloadVisible: false,
  items: [
    {
      label: 'Start layout',
      icon: PrimeIcons.PLAY,
      disabled: isDragAndDropEnabled,
      command: () => graphStore.startLayout()
    },
    {
      label: 'Random layout',
      icon: PrimeIcons.REPLAY,
      disabled: isDragAndDropEnabled,
      command: () => graphStore.randomLayout()
    },
    {
      label: 'Center',
      icon: PrimeIcons.CIRCLE_FILL,
      disabled: isDragAndDropEnabled,
      command: () => graphStore.centerLayout()
    },
    {
      label: 'Unlock positions',
      icon: PrimeIcons.UNLOCK,
      disabled: isOpinionChangeEnabled,
      command: () => graphStore.enableDragAndDrop()
    },
    {
      label: 'Enable opinion change',
      icon: PrimeIcons.USER_EDIT,
      disabled: isDragAndDropEnabled,
      command: () => graphStore.enableOpinionChange()
    },
    {
      label: 'Enable highlighting',
      icon: PrimeIcons.FILTER,
      command: () => graphStore.enableHovering()
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

watch(isDragAndDropEnabled, (newIsDragAndDropEnabled) => {
  const item = state.items[3];
  item.label = (newIsDragAndDropEnabled ? 'Lock' : 'Unlock') + ' positions';
  item.icon = newIsDragAndDropEnabled ? PrimeIcons.LOCK : PrimeIcons.UNLOCK;
  item.command = newIsDragAndDropEnabled ? graphStore.disableDragAndDrop : graphStore.enableDragAndDrop;
});

watch(isOpinionChangeEnabled, (newIsOpinionChangeEnabled) => {
  const item = state.items[4];
  item.label = (newIsOpinionChangeEnabled ? 'Disable' : 'Enable') + ' opinion change';
  item.icon = newIsOpinionChangeEnabled ? PrimeIcons.USER : PrimeIcons.USER_EDIT;
  item.command = newIsOpinionChangeEnabled ? graphStore.disableOpinionChange : graphStore.enableOpinionChange;
});

watch(isHoveringEnabled, (newIsHoveringEnabled) => {
  const item = state.items[5];
  item.label = (newIsHoveringEnabled ? 'Disable' : 'Enable') + ' highlighting';
  item.icon = newIsHoveringEnabled ? PrimeIcons.FILTER_SLASH : PrimeIcons.FILTER;
  item.command = newIsHoveringEnabled ? graphStore.disableHovering : graphStore.enableHovering;
});

function toggleFullscreen(fullscreen: boolean) {
  const item = state.items[state.items.length - 1];
  item.label = fullscreen ? 'Minimize' : 'Maximize';
  item.icon = fullscreen ? PrimeIcons.WINDOW_MINIMIZE : PrimeIcons.WINDOW_MAXIMIZE;
}
</script>

<style scoped lang="scss">
.graph-manipulation-speeddial {
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
