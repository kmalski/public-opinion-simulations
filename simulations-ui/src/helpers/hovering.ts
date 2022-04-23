import { Graph } from '@/helpers/types';
import { Sigma } from 'sigma';
import { EdgeDisplayData, NodeDisplayData } from 'sigma/types';
import { DIMMED_COLOR, HOVERED_EDGE_SIZE } from '@/helpers/defaults';

export interface Hovering {
  hoveredNode?: string;
  hoveredNeighbors?: Set<string>;
}

export type OnEnterNodeListener = ({ node }: { node: string }) => void;

export type OnLeaveNodeListener = () => void;

export function bindHoverEvents(
  state: Hovering,
  graph: Graph,
  renderer: Sigma,
  onEnterNode: OnEnterNodeListener,
  onLeaveNode: OnLeaveNodeListener
) {
  renderer.on('enterNode', onEnterNode);
  renderer.on('leaveNode', onLeaveNode);

  renderer.setSetting('nodeReducer', (node, data) => {
    const res: Partial<NodeDisplayData> = { ...data };

    if (state.hoveredNeighbors && !state.hoveredNeighbors.has(node) && state.hoveredNode !== node) {
      res.label = '';
      res.color = DIMMED_COLOR;
    }

    return res;
  });
  renderer.setSetting('edgeReducer', (edge, data) => {
    const res: Partial<EdgeDisplayData> = { ...data };

    if (state.hoveredNode)
      if (graph.hasExtremity(edge, state.hoveredNode)) res.size = HOVERED_EDGE_SIZE;
      else res.color = DIMMED_COLOR;

    return res;
  });
}

export function unbindHoverEvents(renderer: Sigma, onEnterNode: OnEnterNodeListener, onLeaveNode: OnLeaveNodeListener) {
  renderer.removeListener('enterNode', onEnterNode);
  renderer.removeListener('leaveNode', onLeaveNode);

  renderer.setSetting('nodeReducer', null);
  renderer.setSetting('edgeReducer', null);
}

export function setHoveredNode(state: Hovering, graph: Graph, renderer: Sigma, node?: string) {
  if (node) {
    state.hoveredNode = node;
    state.hoveredNeighbors = new Set(graph.neighbors(node));
  } else {
    state.hoveredNode = undefined;
    state.hoveredNeighbors = undefined;
  }

  renderer.refresh();
}
