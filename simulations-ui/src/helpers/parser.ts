import { parse as graphvizParse } from '@ts-graphviz/parser';
import { parse as gexfParse } from 'graphology-gexf';
import { AttributesValue, EdgeTarget, EdgeTargetTuple, Graph as Graphviz, toDot } from 'ts-graphviz';
import { SIZE } from '@/helpers/defaults';
import { BinaryOpinion, Graph } from '@/helpers/types';
import { opinionToColor } from '@/helpers/graph';
import { write as gexfWrite } from 'graphology-gexf/node';

export function serializeJson(graph: Graph, withPositions: boolean): string {
  const graphCopy = graph.copy();
  graphCopy.forEachNode((node, attributes) => {
    attributes.size = undefined;
    attributes.color = undefined;
    attributes.x = withPositions ? attributes.x : undefined;
    attributes.y = withPositions ? attributes.y : undefined;
  });
  return JSON.stringify(graphCopy.export());
}

export function serializeGexf(graph: Graph, withPositions: boolean): string {
  return gexfWrite(graph, {
    pretty: true,
    formatNode: (key, attributes) => {
      return {
        label: attributes.label,
        viz: withPositions ? { x: attributes.x, y: attributes.y } : undefined
      };
    },
    formatEdge: () => {
      return {};
    }
  });
}

export function parseGexf(fileText: string): Graph {
  const graph = gexfParse(Graph, fileText);
  graph.forEachNode((node, attributes) => {
    const opinion = parseLabel(attributes['label']);
    attributes.color = opinionToColor(opinion);
    attributes.size = SIZE;
  });
  return graph;
}

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
    const opinion = parseLabel(node.attributes.get('label'));
    const pos = parseDotPos(node.attributes.get('pos'));
    const color = opinionToColor(opinion);
    graph.addNode(node.id, {
      size: SIZE,
      color: color,
      label: opinion,
      x: pos[0],
      y: pos[1]
    });
  });

  // Note: assumes that every node was already defined
  graphDot.edges.forEach((edge) => addTargets(graph, edge.targets));

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
        to.forEach((toNode) => graph.addEdge(fromNode.id, toNode.id));
      });
    } else {
      from.forEach((fromNode) => graph.addEdge(fromNode.id, to.id));
    }
  } else if (toIsArray) {
    to.forEach((toNode) => graph.addEdge(from.id, toNode.id));
  } else {
    graph.addEdge(from.id, to.id);
  }
}

function parseDotPos(pos: AttributesValue | undefined): [number, number] | [undefined, undefined] {
  let posArray;
  if (typeof pos === 'string' && pos?.endsWith('!')) posArray = pos.slice(0, -1);
  if (posArray) {
    posArray = posArray.split(',');
    return [+posArray[0], +posArray[1]];
  } else {
    return [undefined, undefined];
  }
}

function parseLabel(label: string | number | boolean | undefined): BinaryOpinion {
  if (!label) throw new Error(`Missing required attribute 'label'`);
  if (typeof label === 'string') return +label > 0 ? '1' : '-1';
  if (typeof label === 'boolean') return label ? '1' : '-1';
  return label > 0 ? '1' : '-1';
}
