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
import Graph from 'graphology';

export default defineComponent({
  name: 'GraphTab',
  data() {
    return {
      reader: new FileReader(),
      graph: {} as Graph,
      filename: ''
    };
  },
  methods: {
    async readFile(event: { files: File[] }) {
      const file = event.files[0] as File;
      const extension = file.name.split('.').pop();
      const text = await file.text();
      switch (extension) {
        case 'gexf':
          this.graph = parseGexf(text);
          break;
        case 'dot':
          this.graph = parseDot(text);
          break;
      }
      await this.$store.dispatch('changeGraph', this.graph);
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

.p-divider.p-divider-horizontal:before {
  border-top: 2px solid #dee2e6;
}
</style>
