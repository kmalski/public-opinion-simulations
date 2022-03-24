import { parse } from '@ts-graphviz/parser';
import Graph from 'graphology';
import { random } from 'graphology-layout';
import { EdgeTarget } from 'ts-graphviz';

const defaultSize = 10;

export async function parseDot(fileUrl: RequestInfo): Promise<Graph> {
  const file = await fetch(fileUrl);
  const dot = await file.text();
  const graphDot = parse(dot);
  const graph = new Graph();

  graphDot.nodes.forEach((node) =>
    graph.addNode(node.id, {
      size: defaultSize,
      label: node.attributes.get('label') || node.id
    })
  );
  console.log(graphDot);

  // TODO: read possible attributes
  // Note: assumes that every node was already defined
  graphDot.edges.forEach((edge) => {
    const from = edge.targets[0];
    const to = edge.targets[1];
    addEdges(graph, from, to);

    const rest = edge.targets[2];
    if (Array.isArray(rest)) {
      let curr = to;
      for (let i = 0; i < rest.length - 1; i++) {
        addEdges(graph, curr, rest[i]);
        curr = rest[i];
      }
    } else if (rest) {
      addEdges(graph, to, rest);
    }
  });

  random.assign(graph);
  return graph;
}

function addEdges(graph: Graph, from: EdgeTarget, to: EdgeTarget): void {
  console.log(from, to);
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
