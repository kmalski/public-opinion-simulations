import { Sigma } from 'sigma';
import { BinaryOpinion, Graph } from '@/helpers/types';
import { SigmaNodeEventPayload } from 'sigma/sigma';
import { opinionToColor } from '@/helpers/graph';

export type OnClickNodeListener = (event: SigmaNodeEventPayload) => void;

export function onClickNodeImpl(event: SigmaNodeEventPayload, graph: Graph) {
  const opinion = graph.getNodeAttribute(event.node, 'label') as BinaryOpinion;
  const newOpinion = opinion === '1' ? '-1' : '1';
  graph.mergeNodeAttributes(event.node, {
    label: newOpinion,
    color: opinionToColor(newOpinion)
  });
}

export function bindOpinionChangeEvents(renderer: Sigma, onClickNode: OnClickNodeListener) {
  renderer.on('clickNode', onClickNode);
}

export function unbindOpinionChangeEvents(renderer: Sigma, onClickNode: OnClickNodeListener) {
  renderer.off('clickNode', onClickNode);
}
