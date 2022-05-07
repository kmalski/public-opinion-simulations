import { BinaryOpinion, Graph, NodeAttributes } from '@/helpers/types';
import { parseLabel } from '@/helpers/parsers/common';
import { NODE_SIZE } from '@/helpers/defaults';
import { opinionToColor } from '@/helpers/graph';

export function serializeNet(graph: Graph, withPositions: boolean): string {
  let result = `*Vertices ${graph.order}\n`;
  let i = 1;

  let minPos = Number.MAX_SAFE_INTEGER;
  let maxPos = Number.MIN_SAFE_INTEGER;
  let normalize: (pos: number) => number;

  if (withPositions) {
    graph.forEachNode((node, { x, y }) => {
      minPos = Math.min(x as number, y as number, minPos);
      maxPos = Math.max(x as number, y as number, maxPos);
    });
    normalize = (pos: number) => (pos - minPos) / (maxPos - minPos);
  }

  graph.forEachNode((node, attributes) => {
    result += `${i} "${attributes.label}"`;
    if (withPositions) {
      const x = normalize(attributes.x as number);
      const y = normalize(attributes.y as number);
      result += ` ${x.toPrecision(4)} ${y.toPrecision(4)}`;
    }
    result += '\n';
    attributes.num = i++;
  });

  result += '*Edges\n';
  graph.forEachEdge((edge, attributes, source, target, sourceAttr, targetAttr) => {
    result += `${sourceAttr.num} ${targetAttr.num}\n`;
  });
  return result;
}

export function parseNet(fileText: string): Graph {
  const graph = new Graph();

  const lines = fileText.split(/\r?\n/);
  if (lines.length === 0) return graph;

  const remainingLines = parseVertices(graph, lines);
  if (remainingLines) parseEdges(graph, remainingLines);

  return graph;
}

function parseVertices(graph: Graph, lines: string[]): string[] | undefined {
  const marker = '*vertices';

  const verticesLine = lines[0].split(/ +/);
  if (verticesLine.length !== 2) throw new Error(`Invalid vertices marker: ${lines[0]}`);
  if (verticesLine[0].toLowerCase() !== marker) throw new Error(`File must start with ${marker} marker`);
  const order = +verticesLine[1];

  if (lines.length > 1) {
    if (lines[1].startsWith('*')) {
      addNodesCount(graph, order);
      return lines.slice(1);
    } else {
      addNodes(graph, lines.slice(1, order + 1));
      return lines.slice(order + 1);
    }
  }
}

function addNodesCount(graph: Graph, count: number) {
  for (let i = 1; i < count + 1; i++)
    graph.addNode(i, {
      size: NODE_SIZE
    });
}

function addNodes(graph: Graph, lines: string[]) {
  for (const line of lines) {
    if (line.startsWith('*')) throw new Error('Invalid marker before declared vertices count');

    const nodeLine = line.split(/ +/);
    if (nodeLine.length === 0) throw new Error('Vertex line can not be empty');

    const attributes: NodeAttributes = {
      size: NODE_SIZE
    };
    if (nodeLine.length >= 2) {
      const opinion = parseNetLabel(nodeLine[1]);
      attributes.label = opinion;
      attributes.color = opinionToColor(opinion);
    }
    if (nodeLine.length >= 4) {
      attributes.x = +nodeLine[2];
      attributes.y = +nodeLine[3];
    }
    graph.addNode(nodeLine[0], attributes);
  }
}

function parseNetLabel(label: string): BinaryOpinion {
  if (label.charAt(0) === '"' && label.charAt(label.length - 1) === '"') {
    return parseLabel(label.substring(1, label.length - 1));
  }
  return parseLabel(label);
}

function parseEdges(graph: Graph, lines: string[]) {
  const markers = ['*edges', '*arcs'];

  const edgesLine = lines[0].split(/ +/);
  if (edgesLine.length !== 1) throw new Error(`Invalid edges marker: ${lines[0]}`);
  if (!markers.includes(edgesLine[0].toLowerCase())) throw new Error(`File must start with one of ${markers} markers`);

  addEdges(graph, lines.slice(1));
}

function addEdges(graph: Graph, lines: string[]) {
  for (const line of lines) {
    if (line.startsWith('*')) throw new Error('Invalid marker before end of edges section');

    const edgeLine = line.split(/ +/);
    if (edgeLine.length !== 2) break;

    graph.addEdge(edgeLine[0], edgeLine[1]);
  }
}
