import { BinaryOpinion, Graph } from '@/helpers/types';
import { COLOR_DOWN, COLOR_UP, SIZE } from '@/helpers/defaults';
import { random } from 'graphology-layout';

export function assignOpinion(graph: Graph, positiveProbability: number) {
  graph.forEachNode((node, attributes) => {
    const opinion = randomOpinion(positiveProbability);
    attributes.label = opinion;
    attributes.color = opinionToColor(opinion);
    attributes.size = SIZE;
  });
}

export function validatePositions(graph: Graph) {
  if (!graph.everyNode((node, { x, y }) => typeof x === 'number' && typeof y === 'number')) {
    random.assign(graph);
    graph.setAttribute('predefinedPositions', false);
  } else {
    graph.setAttribute('predefinedPositions', true);
  }
}

export function randomOpinion(positiveProbability: number): BinaryOpinion {
  if (Math.random() < positiveProbability) return '1';
  return '-1';
}

export function opinionToColor(opinion: BinaryOpinion): string {
  return opinion === '1' ? COLOR_UP : COLOR_DOWN;
}
