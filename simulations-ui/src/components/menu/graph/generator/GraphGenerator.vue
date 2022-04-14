<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { useGraphStore } from '@/stores/graph.store';

export default defineComponent({
  name: 'GraphGenerator',
  methods: {
    ...mapActions(useGraphStore, ['setGraph']),
    generateGraph() {
      console.log('Not implemented');
    }
  }
});
</script>

<style lang="scss">
.p-float-label {
  margin-top: 2rem;
  width: 100%;

  .p-inputnumber {
    width: 100%;
  }
}
</style>
