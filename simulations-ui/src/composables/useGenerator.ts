import { onMounted } from 'vue';
import { useGraphStore } from '@/stores/graph.store';
import { useGeneratorStore } from '@/stores/generator.store';
import { Graph } from '@/helpers/types';
import { assignOpinion } from '@/helpers/graph';
import { useToastStore } from '@/stores/toast.store';

export enum GeneratorName {
  COMPLETE_GENERATOR = 'complete-generator',
  EMPTY_GENERATOR = 'empty-generator',
  LADDER_GENERATOR = 'ladder-generator',
  PATH_GENERATOR = 'path-generator',
  REGULAR_SQUARE_GENERATOR = 'regular-square-generator',
  REGULAR_TRIANGULAR_GENERATOR = 'regular-triangular-generator',
  CAVEMAN_GENERATOR = 'caveman-generator',
  CONNECTED_CAVEMAN_GENERATOR = 'connected-caveman-generator',
  CLUSTERS_GENERATOR = 'clusters-generator',
  ERDOS_RENYI_GENERATOR = 'erdos-renyi-generator',
  GIRVAN_NEWMAN_GENERATOR = 'girvan-newman-generator',
  KRACKHARDT_KITE_GENERATOR = 'krackhardt-kite-generator',
  FLORENTINE_FAMILIES_GENERATOR = 'florentine-families-generator',
  KARATE_CLUB_GENERATOR = 'karate-club-generator'
}

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
