import { onMounted } from 'vue';
import { useGraphStore } from '@/stores/graph.store';
import { useGeneratorStore } from '@/stores/generator.store';
import { Graph } from '@/helpers/types';
import { assignOpinion } from '@/helpers/graph';

export function useGenerator(generateGraph: () => Graph) {
  const graphStore = useGraphStore();
  const generatorStore = useGeneratorStore();

  function generate() {
    const graph = generateGraph();
    assignOpinion(graph, generatorStore.positiveProbability);
    graphStore.setGraph(graph);
  }

  onMounted(() => {
    generatorStore.generate = generate;
  });
}
