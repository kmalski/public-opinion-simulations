import { Sigma } from 'sigma';
import { Graph } from '@/helpers/types';
import { SigmaNodeEventPayload } from 'sigma/sigma';
import { MouseCoords } from 'sigma/types';

export interface DragAndDrop {
  draggedNode?: string;
  isDragging: boolean;
}

export type OnDownNodeListener = (event: SigmaNodeEventPayload) => void;
export type OnMouseMoveBodyListener = (event: MouseCoords) => void;
export type OnMouseUpListener = () => void;
export type OnMouseDownListener = () => void;

export function onDownNodeImpl(event: SigmaNodeEventPayload, dragAndDrop: DragAndDrop, graph: Graph) {
  const node = event.node;
  dragAndDrop.isDragging = true;
  dragAndDrop.draggedNode = node;
  graph.setNodeAttribute(node, 'highlighted', true);
}

export function onMouseMoveBodyImpl(event: MouseCoords, dragAndDrop: DragAndDrop, graph: Graph, renderer: Sigma) {
  if (!dragAndDrop.isDragging || !dragAndDrop.draggedNode) return;

  const pos = renderer.viewportToGraph(event);

  graph.setNodeAttribute(dragAndDrop.draggedNode, 'x', pos.x);
  graph.setNodeAttribute(dragAndDrop.draggedNode, 'y', pos.y);

  event.preventSigmaDefault();
  event.original.preventDefault();
  event.original.stopPropagation();
}

export function onMouseUpImpl(dragAndDrop: DragAndDrop, graph: Graph) {
  if (dragAndDrop.draggedNode) {
    graph.removeNodeAttribute(dragAndDrop.draggedNode, 'highlighted');
  }
  dragAndDrop.isDragging = false;
  dragAndDrop.draggedNode = undefined;
}

export function onMouseDownImpl(renderer: Sigma) {
  if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
}

export function bindDragAndDropEvents(
  dragAndDrop: DragAndDrop,
  graph: Graph,
  renderer: Sigma,
  onDownNode: OnDownNodeListener,
  onMouseMoveBody: OnMouseMoveBodyListener,
  onMouseUp: OnMouseUpListener,
  onMouseDown: OnMouseDownListener
) {
  renderer.prependListener('downNode', onDownNode);
  renderer.getMouseCaptor().prependListener('mousemovebody', onMouseMoveBody);
  renderer.getMouseCaptor().prependListener('mouseup', onMouseUp);
  renderer.getMouseCaptor().prependListener('mousedown', onMouseDown);
}

export function unbindDragAndDropEvents(
  renderer: Sigma,
  onDownNode: OnDownNodeListener,
  onMouseMoveBody: OnMouseMoveBodyListener,
  onMouseUp: OnMouseUpListener,
  onMouseDown: OnMouseDownListener
) {
  renderer.off('downNode', onDownNode);
  renderer.getMouseCaptor().off('mousemovebody', onMouseMoveBody);
  renderer.getMouseCaptor().off('mouseup', onMouseUp);
  renderer.getMouseCaptor().off('mousedown', onMouseDown);

  renderer.setCustomBBox(null);
  renderer.getCamera().animatedReset();
  renderer.refresh();
}
