<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { useGraphStore } from '@/stores/graph.store';
import { useGeneratorStore } from '@/stores/generator.store';
import { Graph } from '@/helpers/types';

export interface GraphGeneratorComponent {
  generateGraph(positiveProbability: number): void;
  setGraph(graph: Graph): void;
  setGenerator(generator: GraphGeneratorComponent): void;
}

export default defineComponent({
  name: 'GraphGenerator',
  mounted() {
    this.setGeneratorComponent(this as unknown as GraphGeneratorComponent);
  },
  methods: {
    ...mapActions(useGraphStore, ['setGraph']),
    ...mapActions(useGeneratorStore, ['setGeneratorComponent'])
  }
});
</script>
