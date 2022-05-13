import { onMounted } from 'vue';
import { useGraphStore } from '@/stores/graph.store';
import { useGeneratorStore } from '@/stores/generator.store';
import { Graph } from '@/helpers/types';
import { assignOpinion } from '@/helpers/graph';
import { useToastStore } from '@/stores/toast.store';

export type GeneratorName =
  | 'complete-generator'
  | 'empty-generator'
  | 'ladder-generator'
  | 'path-generator'
  | 'regular-square-generator'
  | 'regular-triangular-generator'
  | 'caveman-generator'
  | 'connected-caveman-generator'
  | 'clusters-generator'
  | 'erdos-renyi-generator'
  | 'girvan-newman-generator'
  | 'krackhardt-kite-generator'
  | 'florentine-families-generator'
  | 'karate-club-generator';

export function useGenerator(generateGraph: () => Graph) {
  const graphStore = useGraphStore();
  const generatorStore = useGeneratorStore();
  const toastStore = useToastStore();

  function generate() {
    try {
      const graph = generateGraph();
      assignOpinion(graph, generatorStore.positiveProbability);
      graphStore.setGraph(graph);
    } catch (error) {
      toastStore.error = {
        summary: 'Error during graph generation',
        detail: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  onMounted(() => {
    generatorStore.generate = generate;
  });
}
