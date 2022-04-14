import forceAtlas2 from 'graphology-layout-forceatlas2';
import FA2LayoutSupervisor from 'graphology-layout-forceatlas2/worker';
import { random } from 'graphology-layout';
import { Graph } from '@/helpers/types';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { Sigma } from 'sigma';
import { animateNodes } from 'sigma/utils/animate';
import { validatePositions } from '@/helpers/parser';

interface State {
  sigma?: Sigma;
  graph: Graph;
  fa2Layout?: FA2LayoutSupervisor;
  isLayoutRunning: boolean;
  cancelCurrentAnimation?: () => void;
}

function initState() {
  const graph = new Graph();
  graph.addNode('n1', { x: 0, y: 0, size: 10, label: '-1', color: '#f51b00' });
  graph.addNode('n2', { x: -5, y: 5, size: 10, label: '1', color: '#009dff' });
  graph.addNode('n3', { x: 5, y: 5, size: 10, label: '1', color: '#009dff' });
  graph.addNode('n4', { x: 0, y: 10, size: 10, label: '-1', color: '#f51b00' });
  graph.addEdge('n1', 'n2');
  graph.addEdge('n2', 'n4');
  graph.addEdge('n4', 'n3');
  graph.addEdge('n3', 'n1');

  return { graph, isLayoutRunning: false };
}

export const useGraphStore = defineStore('graph', {
  state: (): State => initState(),
  actions: {
    setSigma(container: HTMLElement) {
      if (this.sigma) this.sigma.kill();
      this.sigma = new Sigma(this.graph, container);
    },
    setGraph(graph: Graph) {
      validatePositions(graph);
      this.graph = graph;
      if (!graph.getAttribute('predefinedPositions')) {
        this.startLayout();
        setTimeout(() => this.stopLayout(), 2000);
      }
    },
    startLayout() {
      if (this.cancelCurrentAnimation) this.cancelCurrentAnimation();
      if (this.fa2Layout) this.fa2Layout.kill();

      const sensibleSettings = forceAtlas2.inferSettings(this.graph);
      const fa2Layout = new FA2LayoutSupervisor(this.graph, {
        settings: sensibleSettings
      });

      fa2Layout.start();
      this.isLayoutRunning = true;
      this.fa2Layout = fa2Layout;
    },
    stopLayout() {
      if (this.fa2Layout && this.fa2Layout.isRunning()) {
        this.fa2Layout.stop();
        this.isLayoutRunning = false;
        this.fa2Layout.kill();
        this.fa2Layout = undefined;
      }
    },
    randomLayout() {
      if (this.isLayoutRunning) this.stopLayout();
      if (this.cancelCurrentAnimation) this.cancelCurrentAnimation();

      const randomPositions = random(this.graph, { scale: 100 });
      this.cancelCurrentAnimation = animateNodes(
        this.graph,
        randomPositions,
        { duration: 2000 },
        () => (this.cancelCurrentAnimation = undefined)
      );
    },
    centerLayout() {
      if (this.sigma) {
        this.sigma.getCamera().animatedReset();
      }
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGraphStore, import.meta.hot));
}
