import { BinaryOpinion, Graph, NodeAttributes } from '@/helpers/types';
import { NODE_SIZE } from '@/helpers/defaults';
import { opinionToColor } from '@/helpers/graph';
import { parseLabel, serializePos, whitespaceSeparator } from '@/helpers/parsers/common';

interface SerializationResult {
  result: string;
  nodes: string[];
}

export function serializeVertices(graph: Graph, withPositions: boolean): SerializationResult {
  let result = `*Vertices ${graph.order}\n`;
  let i = 1;
  const nodes = new Array(graph.order);

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
      result += ` ${serializePos(x)} ${serializePos(y)}`;
    }
    result += '\n';
    nodes[i - 1] = node;
    attributes.num = i++;
  });

  return { result, nodes };
}

export function parseVertices(graph: Graph, lines: string[]): string[] | undefined {
  const marker = '*vertices';

  const verticesLine = lines[0].split(whitespaceSeparator);
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
    if (!line) throw new Error('Vertex line can not be empty');

    const nodeLine = line.split(whitespaceSeparator);

    const attributes: NodeAttributes = {
      size: NODE_SIZE
    };
    if (nodeLine.length >= 2) {
      const opinion = parseQuotedLabel(nodeLine[1]);
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

function parseQuotedLabel(label: string): BinaryOpinion {
  if (label.charAt(0) === '"' && label.charAt(label.length - 1) === '"') {
    return parseLabel(label.substring(1, label.length - 1));
  }
  return parseLabel(label);
}
