<template>
  <div class="file-section">
    <div class="file-section-hint">
      <p>Load graph from file</p>
      <div class="file-section-links">
        <a class="file-section-link" :href="'/files/graph.dot'" download>*.dot</a>
        <a class="file-section-link" :href="'/files/graph.gexf'" download>*.gexf</a>
      </div>
    </div>
    <div class="file-section-button">
      <file-upload
        name="graph"
        url="/"
        mode="basic"
        :custom-upload="true"
        @uploader="readFile"
        accept=".gexf,.dot"
      ></file-upload>
    </div>
  </div>

  <divider> </divider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { parseDot, parseGexf } from '@/helpers/parser';
import { Graph } from '@/helpers/types';

export default defineComponent({
  name: 'GraphTab',
  methods: {
    async readFile(event: { files: File | File[] }) {
      const file = Array.isArray(event.files) ? event.files[0] : event.files;
      const extension = file.name.split('.').pop();
      const text = await file.text();

      let graph: Graph;
      switch (extension) {
        case 'gexf':
          graph = parseGexf(text);
          break;
        case 'dot':
          graph = parseDot(text);
          break;
        default:
          graph = new Graph();
        //TODO: add toast message
      }
      await this.$store.dispatch('changeGraph', graph);
    }
  }
});
</script>

<style scoped lang="scss">
.file-section {
  display: flex;
  flex-direction: row;

  &-hint {
    flex: 60%;
    text-align: left;
    padding-left: 1rem;
    margin: 0.5rem;

    p {
      margin: 0;
    }
  }

  &-button {
    flex: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-links {
    text-align: left;
    > :first-child {
      margin-left: 0;
    }
  }

  &-link {
    margin: auto 0.5rem;
    color: #2196f3;
  }
}
</style>
