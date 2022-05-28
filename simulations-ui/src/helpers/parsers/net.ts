import { Graph } from '@/helpers/types';
import { newlineSeparator, whitespaceSeparator } from '@/helpers/parsers/common';
import { serializeVertices, parseVertices } from '@/helpers/parsers/pajek';

export function serializeNet(graph: Graph, withPositions: boolean): string {
  let { result } = serializeVertices(graph, withPositions);

  result += '*Edges\n';
  graph.forEachEdge((edge, attributes, source, target, sourceAttr, targetAttr) => {
    result += `${sourceAttr.num} ${targetAttr.num}\n`;
  });
  return result;
}

export function parseNet(fileText: string): Graph {
  const graph = new Graph();

  const lines = fileText.split(newlineSeparator);
  if (lines.length === 0) return graph;

  const remainingLines = parseVertices(graph, lines);
  if (remainingLines) parseEdges(graph, remainingLines);

  return graph;
}

function parseEdges(graph: Graph, lines: string[]) {
  const markers = ['*edges', '*arcs'];

  const edgesLine = lines[0].split(whitespaceSeparator);
  if (edgesLine.length !== 1) throw new Error(`Invalid edges marker: ${lines[0]}`);
  if (!markers.includes(edgesLine[0].toLowerCase())) throw new Error(`File must start with one of ${markers} markers`);

  addEdges(graph, lines.slice(1));
}

function addEdges(graph: Graph, lines: string[]) {
  for (const line of lines) {
    if (line.startsWith('*')) throw new Error('Invalid marker before end of edges section');
    if (!line) continue;

    const edgeLine = line.split(whitespaceSeparator);
    if (edgeLine.length !== 2) throw new Error(`Invalid edge definition: ${line}`);

    graph.addEdge(edgeLine[0], edgeLine[1]);
  }
}
