<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { useGraphStore } from '@/stores/graph.store';

export default defineComponent({
  name: 'GraphGenerator',
  methods: {
    ...mapActions(useGraphStore, ['setGraph']),
    generateGraph(positiveProbability: number) {
      // abstract
    }
  }
});
</script>
