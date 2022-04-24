import forceAtlas2 from 'graphology-layout-forceatlas2';
import FA2LayoutSupervisor from 'graphology-layout-forceatlas2/worker';
import { random } from 'graphology-layout';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { Sigma } from 'sigma';
import { animateNodes } from 'sigma/utils/animate';
import { Graph, Optional } from '@/helpers/types';
import { validatePositions } from '@/helpers/graph';
import { bindHoverEvents, Hovering, setHoveredNode, unbindHoverEvents } from '@/helpers/hovering';

interface State {
  graph: Graph;
  isLayoutRunning: boolean;
  hovering: Hovering;
  isHoveringEnabled: boolean;
  renderer: Optional<Sigma>;
  fa2Layout: Optional<FA2LayoutSupervisor>;
  cancelCurrentAnimation: Optional<() => void>;
}

export const useGraphStore = defineStore('graph', {
  state: (): State => {
    const graph = new Graph();
    graph.addNode('n1', { x: 0, y: 0, size: 10, label: '-1', color: '#f51b00' });
    graph.addNode('n2', { x: -5, y: 5, size: 10, label: '1', color: '#009dff' });
    graph.addNode('n3', { x: 5, y: 5, size: 10, label: '1', color: '#009dff' });
    graph.addNode('n4', { x: 0, y: 10, size: 10, label: '-1', color: '#f51b00' });
    graph.addEdge('n1', 'n2');
    graph.addEdge('n2', 'n4');
    graph.addEdge('n4', 'n3');
    graph.addEdge('n3', 'n1');

    return {
      graph,
      isLayoutRunning: false,
      hovering: {},
      isHoveringEnabled: false,
      renderer: undefined,
      fa2Layout: undefined,
      cancelCurrentAnimation: undefined
    };
  },
  actions: {
    setRenderer(container: HTMLElement) {
      if (this.renderer) this.renderer.kill();
      this.renderer = new Sigma(this.graph, container);
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
      if (this.renderer) {
        this.renderer.getCamera().animatedReset();
      }
    },
    enableHovering() {
      if (this.renderer) {
        bindHoverEvents(this.hovering, this.graph, this.renderer as Sigma, this.onEnterNode, this.onLeaveNode);
        this.isHoveringEnabled = true;
      }
    },
    disableHovering() {
      if (this.renderer) {
        unbindHoverEvents(this.renderer as Sigma, this.onEnterNode, this.onLeaveNode);
        this.isHoveringEnabled = false;
      }
    },
    onEnterNode({ node }: { node: string }) {
      setHoveredNode(this.hovering, this.graph, this.renderer as Sigma, node);
    },
    onLeaveNode() {
      setHoveredNode(this.hovering, this.graph, this.renderer as Sigma, undefined);
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGraphStore, import.meta.hot));
}
