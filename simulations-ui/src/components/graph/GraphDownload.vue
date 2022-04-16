<template>
  <prime-dialog header="Download" v-model:visible="visible" :modal="true" @hide="onHide" @show="onShow">
    <div class="graph-download">
      <p class="graph-download-hint">Enter download options</p>

      <span class="float-input">
        <label class="float-input-label" for="filename">File name</label>
        <input-text id="filename" v-model="filename"></input-text>
      </span>

      <span class="float-input">
        <label class="float-input-label" for="format">File format</label>
        <dropdown id="format" v-model="format" :options="formats" placeholder="Select Format"></dropdown>
      </span>

      <span class="float-input">
        <label class="float-input-label" for="withPositions">Export positions</label>
        <input-switch id="withPositions" v-model="withPositions"></input-switch>
      </span>
    </div>

    <template #footer>
      <prime-button label="Cancel" icon="pi pi-times" @click="onCancel" class="p-button-text" />
      <prime-button label="OK" icon="pi pi-check" @click="onOk" />
    </template>
  </prime-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { saveAsDot, saveAsGexf, saveAsJson } from '@/helpers/download';
import { mapState } from 'pinia';
import { useGraphStore } from '@/stores/graph.store';
import PrimeDialog from 'primevue/dialog';

export default defineComponent({
  name: 'GraphDownload',
  components: { PrimeDialog },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      visible: false,
      format: 'dot',
      filename: 'graph',
      withPositions: false,
      formats: ['dot', 'json', 'gexf']
    };
  },
  computed: {
    ...mapState(useGraphStore, ['graph'])
  },
  watch: {
    modelValue(newValue) {
      this.visible = newValue;
    }
  },
  methods: {
    onOk() {
      if (!this.graph) return;
      switch (this.format) {
        case 'dot':
          saveAsDot(this.graph, this.filename, this.withPositions);
          break;
        case 'json':
          saveAsJson(this.graph, this.filename, this.withPositions);
          break;
        case 'gexf':
          saveAsGexf(this.graph, this.filename, this.withPositions);
          break;
      }
      this.visible = false;
    },
    onCancel() {
      this.visible = false;
    },
    onShow() {
      this.$emit('update:modelValue', true);
    },
    onHide() {
      this.$emit('update:modelValue', false);
    }
  }
});
</script>

<style scoped lang="scss">
@use '../../styles/forms';

.graph-download {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: flex-start;
  width: 20rem;

  &-hint {
    width: 100%;
    margin: 0 0 1rem;
    text-align: left;
  }

  .p-inputnumber {
    width: 70%;
  }

  .p-inputtext {
    width: 90%;
  }

  .p-dropdown {
    width: 90%;
  }
}
</style>
