<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { useGraphStore } from '@/stores/graph.store';
import { useGeneratorStore } from '@/stores/generator.store';
import { Graph } from '@/helpers/types';

export interface GraphGenerator {
  generateGraph(positiveProbability: number): void;
  setGraph(graph: Graph): void;
  setGenerator(generator: GraphGenerator): void;
}

export default defineComponent({
  name: 'GraphGenerator',
  mounted() {
    this.setGenerator(this);
  },
  methods: {
    ...mapActions(useGraphStore, ['setGraph']),
    ...mapActions(useGeneratorStore, ['setGenerator'])
  }
});
</script>
