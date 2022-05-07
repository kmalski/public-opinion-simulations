import forceAtlas2 from 'graphology-layout-forceatlas2';
import FA2LayoutSupervisor from 'graphology-layout-forceatlas2/worker';
import { random } from 'graphology-layout';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { Sigma } from 'sigma';
import { animateNodes } from 'sigma/utils/animate';
import { Graph, Optional } from '@/helpers/types';
import { validatePositions } from '@/helpers/graph';
import { bindHoverEvents, Hovering, setHoveredNode, unbindHoverEvents } from '@/helpers/hovering';
import {
  bindDragAndDropEvents,
  DragAndDrop,
  onDownNodeImpl,
  onMouseDownImpl,
  onMouseMoveBodyImpl,
  onMouseUpImpl,
  unbindDragAndDropEvents
} from '@/helpers/drag-and-drop';
import { SigmaNodeEventPayload } from 'sigma/sigma';
import { MouseCoords } from 'sigma/types';
import { bindOpinionChangeEvents, onClickNodeImpl, unbindOpinionChangeEvents } from '@/helpers/opinion-change';
import { useToastStore } from '@/stores/toast.store';

interface State {
  graph: Graph;
  graphBackup: Graph;
  isLayoutRunning: boolean;
  hovering: Hovering;
  isHoveringEnabled: boolean;
  dragAndDrop: DragAndDrop;
  isDragAndDropEnabled: boolean;
  isOpinionChangeEnabled: boolean;
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
      graphBackup: graph.copy(),
      isLayoutRunning: false,
      hovering: {},
      isHoveringEnabled: false,
      dragAndDrop: { isDragging: false },
      isDragAndDropEnabled: false,
      isOpinionChangeEnabled: false,
      renderer: undefined,
      fa2Layout: undefined,
      cancelCurrentAnimation: undefined
    };
  },
  actions: {
    setRenderer(container: HTMLElement) {
      if (this.renderer) this.renderer.kill();
      this.renderer = new Sigma(this.graph, container);
      if (this.isHoveringEnabled) this.enableHovering();
      if (this.isDragAndDropEnabled) this.enableDragAndDrop();
    },
    setGraph(graph: Graph) {
      validatePositions(graph);
      this.graph = graph;
      if (!graph.getAttribute('predefinedPositions')) {
        this.startLayout();
        setTimeout(() => this.stopLayout(), 2000);
      }
    },
    backupGraph() {
      this.graphBackup = this.graph.copy();
      useToastStore().success = {
        summary: 'Graph backup created',
        detail: 'Graph backup was successfully created'
      };
    },
    restoreToBackup() {
      this.graph = this.graphBackup.copy();
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
    enableDragAndDrop() {
      if (this.renderer) {
        if (this.isLayoutRunning) this.stopLayout();
        if (this.cancelCurrentAnimation) this.cancelCurrentAnimation();

        bindDragAndDropEvents(
          this.dragAndDrop,
          this.graph,
          this.renderer as Sigma,
          this.onDownNode,
          this.onMouseMoveBody,
          this.onMouseUp,
          this.onMouseDown
        );
        this.isDragAndDropEnabled = true;
      }
    },
    disableDragAndDrop() {
      if (this.renderer) {
        unbindDragAndDropEvents(
          this.renderer as Sigma,
          this.onDownNode,
          this.onMouseMoveBody,
          this.onMouseUp,
          this.onMouseDown
        );
        this.isDragAndDropEnabled = false;
      }
    },
    enableOpinionChange() {
      if (this.renderer) {
        bindOpinionChangeEvents(this.renderer as Sigma, this.onClickNode);
        this.isOpinionChangeEnabled = true;
      }
    },
    disableOpinionChange() {
      if (this.renderer) {
        unbindOpinionChangeEvents(this.renderer as Sigma, this.onClickNode);
        this.isOpinionChangeEnabled = false;
      }
    },
    onEnterNode({ node }: { node: string }) {
      setHoveredNode(this.hovering, this.graph, this.renderer as Sigma, node);
    },
    onLeaveNode() {
      setHoveredNode(this.hovering, this.graph, this.renderer as Sigma, undefined);
    },
    onDownNode(event: SigmaNodeEventPayload) {
      onDownNodeImpl(event, this.dragAndDrop, this.graph);
    },
    onMouseMoveBody(event: MouseCoords) {
      onMouseMoveBodyImpl(event, this.dragAndDrop, this.graph, this.renderer as Sigma);
    },
    onMouseUp() {
      onMouseUpImpl(this.dragAndDrop, this.graph);
    },
    onMouseDown() {
      onMouseDownImpl(this.renderer as Sigma);
    },
    onClickNode(event: SigmaNodeEventPayload) {
      onClickNodeImpl(event, this.graph);
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGraphStore, import.meta.hot));
}
