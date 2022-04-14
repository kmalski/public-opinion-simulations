<template>
  <div class="graph-upload">
    <div class="graph-upload-hint">
      <p>Load graph from file</p>
      <div class="graph-upload-links">
        <a class="graph-upload-link" :href="'/files/graph.dot'" download="graph.dot">*.dot</a>
        <a class="graph-upload-link" :href="'/files/graph.gexf'" download="graph.gexf">*.gexf</a>
      </div>
    </div>
    <div class="graph-upload-button">
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { parseDot, parseGexf } from '@/helpers/parser';
import { mapActions } from 'pinia';
import { useGraphStore } from '@/stores/graph.store';
import { ToastSeverity } from 'primevue/api';

export default defineComponent({
  name: 'GraphUpload',
  methods: {
    ...mapActions(useGraphStore, ['setGraph']),
    async readFile(event: { files: File | File[] }) {
      const file = Array.isArray(event.files) ? event.files[0] : event.files;
      const extension = file.name.split('.').pop();
      const text = await file.text();

      try {
        switch (extension) {
          case 'gexf':
            this.setGraph(parseGexf(text));
            break;
          case 'dot':
            this.setGraph(parseDot(text));
            break;
        }
      } catch (error) {
        this.$toast.add({
          severity: ToastSeverity.ERROR,
          summary: 'Error while reading graph',
          detail: error instanceof Error ? error.message : 'Unknown error',
          life: 10000
        });
      }
    }
  }
});
</script>

<style scoped lang="scss">
.graph-upload {
  display: flex;
  flex-direction: row;
  width: 90%;
  justify-content: space-between;
  align-items: center;

  &-hint {
    flex: 60%;
    text-align: left;

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
