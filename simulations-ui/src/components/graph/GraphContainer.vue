<template>
  <div class="graph-container" ref="graph-container"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGraphStore } from '@/stores/graph.store';
import { mapActions, mapState } from 'pinia';

export default defineComponent({
  name: 'GraphContainer',
  computed: {
    ...mapState(useGraphStore, ['graph', 'isHoveringEnabled'])
  },
  watch: {
    graph() {
      this.setSigma(this.$refs['graph-container'] as HTMLDivElement);
      if (this.isHoveringEnabled) this.enableHovering();
    }
  },
  mounted() {
    this.setSigma(this.$refs['graph-container'] as HTMLDivElement);
  },
  methods: {
    ...mapActions(useGraphStore, ['setSigma', 'enableHovering'])
  }
});
</script>

<style scoped lang="scss">
.graph-container {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
