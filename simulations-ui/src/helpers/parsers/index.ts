import { parse as gexfParse } from 'graphology-gexf';
import { NODE_SIZE } from '@/helpers/defaults';
import { Graph, NodeAttributes } from '@/helpers/types';
import { opinionToColor } from '@/helpers/graph';
import { write as gexfWrite } from 'graphology-gexf/node';
import { parseLabel, serializePos } from '@/helpers/parsers/common';

export { parseNet, serializeNet } from '@/helpers/parsers/net';
export { parseDot, serializeDot } from '@/helpers/parsers/dot';
export { parseGam, serializeGam } from '@/helpers/parsers/gam';

export function serializeJson(graph: Graph, withPositions: boolean): string {
  const serializedGraph = graph.export();
  // @ts-ignore
  serializedGraph.options = undefined;
  // @ts-ignore
  serializedGraph.attributes = undefined;

  serializedGraph.nodes.forEach((node) => {
    const attr = node.attributes as NodeAttributes;
    node.attributes = {
      label: attr?.label ?? '',
      x: withPositions ? Number(serializePos(attr.x)) : undefined,
      y: withPositions ? Number(serializePos(attr.y)) : undefined
    };
  });
  serializedGraph.edges.forEach((edge) => {
    edge.key = undefined;
    edge.undirected = undefined;
    edge.attributes = undefined;
  });
  return JSON.stringify(serializedGraph);
}

export function parseJson(fileText: string): Graph {
  const graphJson = JSON.parse(fileText);

  if (graphJson?.options?.multi) throw new Error('Parallel edges are not allowed');
  if (graphJson?.options?.allowSelfLoops) throw new Error('Self loops are not allowed');
  if (graphJson?.options?.type && graphJson.options.type !== 'undirected')
    throw new Error('Graph has to be undirected');

  if (Array.isArray(graphJson?.edges))
    graphJson.edges.forEach((edge: any) => {
      if (typeof edge.undirected !== 'undefined' && edge.undirected === false)
        throw new Error('Directed edges are not allowed');
      if (edge) edge.undirected = true;
    });

  const graph = Graph.create(graphJson);
  graph.forEachNode((node, attributes) => {
    attributes.size = NODE_SIZE;
    if (attributes.label) {
      const opinion = parseLabel(attributes.label);
      attributes.color = opinionToColor(opinion);
    }
  });
  return graph;
}

export function serializeGexf(graph: Graph, withPositions: boolean): string {
  return gexfWrite(graph, {
    pretty: true,
    formatNode: (key, attributes) => {
      return {
        label: attributes.label,
        viz: withPositions
          ? { x: Number(serializePos(attributes.x)), y: Number(serializePos(attributes.y)) }
          : undefined
      };
    },
    formatEdge: () => {
      return {};
    }
  });
}

export function parseGexf(fileText: string): Graph {
  const graph = gexfParse(Graph, fileText);

  if (graph.type !== 'undirected') throw new Error('Graph has to be undirected');

  graph.forEachNode((node, attributes) => {
    attributes.size = NODE_SIZE;
    if (attributes.label) {
      const opinion = parseLabel(attributes.label);
      attributes.color = opinionToColor(opinion);
    }
  });
  return graph;
}
