import { Graph, NodeAttributes } from '@/helpers/types';
import { parse as graphvizParse } from '@ts-graphviz/parser';
import { opinionToColor } from '@/helpers/graph';
import { NODE_SIZE } from '@/helpers/defaults';
import { AttributesValue, EdgeTarget, EdgeTargetTuple, Graph as Graphviz, toDot } from 'ts-graphviz';
import { parseLabel } from '@/helpers/parsers/common';

export function serializeDot(graph: Graph, withPositions: boolean): string {
  const graphviz = new Graphviz();
  graph.forEachNode((node, attributes) => {
    const attr = {
      label: attributes.label,
      pos: withPositions ? `${attributes.x},${attributes.y}!` : undefined
    };
    graphviz.createNode(node, attr);
  });

  graph.forEachEdge((edge, attributes, source, target) => {
    graphviz.createEdge([source, target]);
  });

  return toDot(graphviz);
}

export function parseDot(fileText: string): Graph {
  const graphDot = graphvizParse(fileText);
  const graph = new Graph();

  graphDot.nodes.forEach((node) => {
    const pos = parsePos(node.attributes.get('pos'));
    const attributes: NodeAttributes = {
      size: NODE_SIZE,
      x: pos[0],
      y: pos[1]
    };

    const label = node.attributes.get('label');
    if (label) {
      const opinion = parseLabel(label);
      attributes.label = opinion;
      attributes.color = opinionToColor(opinion);
    }

    graph.addNode(node.id, attributes);
  });

  graphDot.edges.forEach((edge) => addTargets(graph, edge.targets));

  graph.forEachNode((node, attributes) => {
    if (!attributes.size) attributes.size = NODE_SIZE;
  });

  return graph;
}

function addTargets(graph: Graph, targets: EdgeTargetTuple): void {
  const from = targets[0];
  const to = targets[1];
  addEdges(graph, from, to);

  const rest = targets[2];
  if (Array.isArray(rest)) {
    let curr = to;
    for (let i = 0; i < rest.length - 1; i++) {
      addEdges(graph, curr, rest[i]);
      curr = rest[i];
    }
  } else if (rest) {
    addEdges(graph, to, rest);
  }
}

function addEdges(graph: Graph, from: EdgeTarget, to: EdgeTarget): void {
  const fromIsArray = Array.isArray(from);
  const toIsArray = Array.isArray(to);

  if (fromIsArray) {
    if (toIsArray) {
      from.forEach((fromNode) => {
        to.forEach((toNode) => graph.mergeEdge(fromNode.id, toNode.id));
      });
    } else {
      from.forEach((fromNode) => graph.mergeEdge(fromNode.id, to.id));
    }
  } else if (toIsArray) {
    to.forEach((toNode) => graph.mergeEdge(from.id, toNode.id));
  } else {
    graph.mergeEdge(from.id, to.id);
  }
}

function parsePos(pos: AttributesValue | undefined): [number, number] | [undefined, undefined] {
  let posArray;
  if (typeof pos === 'string' && pos?.endsWith('!')) posArray = pos.slice(0, -1);
  if (posArray) {
    posArray = posArray.split(',');
    return [+posArray[0], +posArray[1]];
  } else {
    return [undefined, undefined];
  }
}
