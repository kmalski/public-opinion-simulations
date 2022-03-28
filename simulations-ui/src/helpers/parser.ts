import { parse as graphvizParse } from '@ts-graphviz/parser';
import { parse as gexfParse } from 'graphology-gexf';
import { random } from 'graphology-layout';
import { EdgeTarget, EdgeTargetTuple } from 'ts-graphviz';
import Graph from 'graphology';

const defaultSize = 10;

export function parseGexf(fileText: string): Graph {
  const graph = gexfParse(Graph, fileText);

  if (graph.everyNode((node, attributes) => attributes['x'] && attributes['y'])) {
    return graph;
  } else {
    random.assign(graph);
    return graph;
  }
}

export function parseDot(fileText: string): Graph {
  const graphDot = graphvizParse(fileText);
  const graph = new Graph();

  graphDot.nodes.forEach((node) =>
    graph.addNode(node.id, {
      size: defaultSize,
      label: node.attributes.get('label') || node.id
    })
  );

  // TODO: read possible attributes
  // Note: assumes that every node was already defined
  graphDot.edges.forEach((edge) => addTargets(graph, edge.targets));

  random.assign(graph);
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
