<template>
  <div class="graph-upload">
    <div class="graph-upload-hint">
      <p>Load graph from file</p>
      <div class="graph-upload-links">
        <a class="graph-upload-link" :href="'/files/graph.dot'" download="graph.dot">*.dot</a>
        <a class="graph-upload-link" :href="'/files/graph.gexf'" download="graph.gexf">*.gexf</a>
        <a class="graph-upload-link" :href="'/files/graph.json'" download="graph.json">*.json</a>
        <a class="graph-upload-link" :href="'/files/graph.net'" download="graph.net">*.net</a>
        <a class="graph-upload-link" :href="'/files/graph.gam'" download="graph.gam">*.gam</a>
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
        accept=".gexf,.dot,.json,.net,.gam"
      ></file-upload>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGraphStore } from '@/stores/graph.store';
import { useToastStore } from '@/stores/toast.store';
import { useSimulationStore } from '@/stores/simulation.store';
import { assignMissingOpinions } from '@/helpers/graph';
import { parseDot, parseGexf, parseJson, parseNet, parseGam } from '@/helpers/parsers';

const graphStore = useGraphStore();
const toastStore = useToastStore();
const simulationStore = useSimulationStore();
const { isRunning } = storeToRefs(simulationStore);

async function readFile(event: { files: File | File[] }) {
  const file = Array.isArray(event.files) ? event.files[0] : event.files;
  const extension = file.name.split('.').pop();
  const text = await file.text();

  let graph;
  try {
    switch (extension) {
      case 'gexf':
        graph = parseGexf(text);
        break;
      case 'dot':
        graph = parseDot(text);
        break;
      case 'json':
        graph = parseJson(text);
        break;
      case 'net':
        graph = parseNet(text);
        break;
      case 'gam':
        graph = parseGam(text);
        break;
    }
  } catch (error) {
    toastStore.error = {
      summary: 'Error while reading graph',
      detail: error instanceof Error ? error.message : 'Unknown error'
    };
  }
  if (graph) {
    assignMissingOpinions(graph);
    graphStore.setGraph(graph);
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
    padding-right: 2rem;
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
    display: flex;
    flex-flow: row wrap;
    text-align: left;
    column-gap: 0.7rem;
  }

  &-link {
    color: variables.$saga-blue;
  }
}
</style>
