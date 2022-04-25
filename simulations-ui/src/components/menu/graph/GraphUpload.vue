<template>
  <div class="graph-upload">
    <div class="graph-upload-hint">
      <p>Load graph from file</p>
      <div class="graph-upload-links">
        <a class="graph-upload-link" :href="'/files/graph.dot'" download="graph.dot">*.dot</a>
        <a class="graph-upload-link" :href="'/files/graph.gexf'" download="graph.gexf">*.gexf</a>
        <a class="graph-upload-link" :href="'/files/graph.json'" download="graph.json">*.json</a>
      </div>
    </div>
    <div class="graph-upload-button">
      <file-upload
        :disabled="isRunning"
        name="graph"
        url="/"
        mode="basic"
        :custom-upload="true"
        @uploader="readFile"
        accept=".gexf,.dot,.json"
      ></file-upload>
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseDot, parseGexf, parseJson } from '@/helpers/parser';
import { storeToRefs } from 'pinia';
import { useGraphStore } from '@/stores/graph.store';
import { useToastStore } from '@/stores/toast.store';
import { useSimulationStore } from '@/stores/simulation.store';

const graphStore = useGraphStore();
const toastStore = useToastStore();
const simulationStore = useSimulationStore();
const { isRunning } = storeToRefs(simulationStore);

async function readFile(event: { files: File | File[] }) {
  const file = Array.isArray(event.files) ? event.files[0] : event.files;
  const extension = file.name.split('.').pop();
  const text = await file.text();

  try {
    switch (extension) {
      case 'gexf':
        graphStore.setGraph(parseGexf(text));
        break;
      case 'dot':
        graphStore.setGraph(parseDot(text));
        break;
      case 'json':
        graphStore.setGraph(parseJson(text));
        break;
    }
  } catch (error) {
    toastStore.error = {
      summary: 'Error while reading graph',
      detail: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
</script>

<style scoped lang="scss">
@use '../../../styles/variables';

.graph-upload {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  width: 90%;
  margin: 0 auto;

  &-hint {
    text-align: left;

    p {
      margin: 0;
    }
  }

  &-button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }

  &-links {
    text-align: left;
    > :first-child {
      margin-left: 0;
    }
  }

  &-link {
    margin: auto 0.5rem;
    color: variables.$saga-blue;
  }
}
</style>
