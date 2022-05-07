<template>
  <prime-dialog
    class="graph-download"
    header="Download"
    v-model:visible="state.visible"
    :modal="true"
    @hide="onHide"
    @show="onShow"
  >
    <div class="graph-download-content">
      <p class="graph-download-hint">Enter download options</p>

      <span class="form-input">
        <label class="form-input-label" for="filename">File name</label>
        <input-text id="filename" v-model="state.filename"></input-text>
      </span>

      <span class="form-input">
        <label class="form-input-label" for="format">File format</label>
        <dropdown id="format" v-model="state.format" :options="formats" placeholder="Select Format"></dropdown>
      </span>

      <span class="form-input">
        <label class="form-input-label" for="withPositions">Export positions</label>
        <input-switch id="withPositions" v-model="state.withPositions"></input-switch>
      </span>
    </div>

    <template #footer>
      <div class="graph-download-footer">
        <prime-button label="Cancel" icon="pi pi-times" @click="onCancel" class="p-button-text" />
        <prime-button label="OK" icon="pi pi-check" @click="onOk" />
      </div>
    </template>
  </prime-dialog>
</template>

<script setup lang="ts">
import { reactive, watch, toRefs } from 'vue';
import PrimeDialog from 'primevue/dialog';
import { useGraphStore } from '@/stores/graph.store';
import { saveAsDot, saveAsGexf, saveAsJson, saveAsNet } from '@/helpers/download';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', modelValue: boolean): void;
}

const graphStore = useGraphStore();
const props = defineProps<Props>();
const { modelValue } = toRefs(props);
const emit = defineEmits<Emits>();

const formats = ['dot', 'json', 'gexf', 'net'];
const state = reactive({
  visible: false,
  format: 'dot',
  filename: 'graph',
  withPositions: false
});

watch(modelValue, (newModelValue) => {
  state.visible = newModelValue;
});

function onOk() {
  if (!graphStore.graph) return;
  switch (state.format) {
    case 'dot':
      saveAsDot(graphStore.graph, state.filename, state.withPositions);
      break;
    case 'json':
      saveAsJson(graphStore.graph, state.filename, state.withPositions);
      break;
    case 'gexf':
      saveAsGexf(graphStore.graph, state.filename, state.withPositions);
      break;
    case 'net':
      saveAsNet(graphStore.graph, state.filename, state.withPositions);
      break;
  }
  state.visible = false;
}

function onCancel() {
  state.visible = false;
}

function onShow() {
  emit('update:modelValue', true);
}

function onHide() {
  emit('update:modelValue', false);
}
</script>

<style scoped lang="scss">
@use '../../styles/forms';
.graph-download {
  &-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: center;
    align-items: flex-start;
    width: 15rem;

    &-hint {
      width: 100%;
      margin: 0 0 1rem;
      text-align: left;
    }

    .p-inputtext {
      width: 100%;
    }

    .p-dropdown {
      width: 100%;
    }
  }

  &-footer {
    display: flex;
    justify-content: space-between;

    .p-button {
      margin: 0;
    }
  }
}
</style>
