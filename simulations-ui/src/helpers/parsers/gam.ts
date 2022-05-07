import { Graph } from '@/helpers/types';
import { addNodes, addNodesCount, newlineSeparator, serializePos, whitespaceSeparator } from '@/helpers/parsers/common';

export function serializeGam(graph: Graph, withPositions: boolean): string {
  let result = `Vertices ${graph.order}\n`;

  const nodes = new Array(graph.order);

  let i = 1;
  graph.forEachNode((node, attributes) => {
    result += `${i} "${attributes.label}"`;
    if (withPositions) {
      const x = serializePos(attributes.x);
      const y = serializePos(attributes.y);
      result += ` ${x} ${y}`;
    }
    result += '\n';
    nodes[i - 1] = node;
    attributes.num = i++;
  });

  result += 'Matrix\n';
  for (const node of nodes) {
    const neighbors = graph.mapNeighbors(node, (neighbor, neighAttrs) => {
      return neighAttrs.num;
    });

    let row = '';
    for (let j = 1; j < graph.order + 1; j++) {
      const val = neighbors.includes(j) ? 1 : 0;
      row += `${val} `;
    }
    result += row + '\n';
  }

  return result;
}

export function parseGam(fileText: string): Graph {
  const graph = new Graph();

  const lines = fileText.split(newlineSeparator);
  if (lines.length === 0) return graph;

  const remainingLines = parseVertices(graph, lines);
  parseMatrix(graph, remainingLines);

  return graph;
}

function parseVertices(graph: Graph, lines: string[]): string[] {
  const marker = 'vertices';

  const verticesLine = lines[0].split(/ +/);
  if (verticesLine.length !== 2) throw new Error(`Invalid vertices marker: ${lines[0]}`);
  if (verticesLine[0].toLowerCase() !== marker) throw new Error(`File must start with ${marker} marker`);
  const order = +verticesLine[1];

  if (lines.length > 1) {
    if (lines[1].startsWith('Matrix')) {
      addNodesCount(graph, order);
      return lines.slice(1);
    } else {
      addNodes(graph, lines.slice(1, order + 1));
      return lines.slice(order + 1);
    }
  } else {
    throw new Error('Missing matrix definition');
  }
}

function parseMatrix(graph: Graph, lines: string[]) {
  const marker = 'matrix';

  if (lines.length < graph.order) throw new Error('Matrix size is smaller than defined vertices');

  const matrixLine = lines[0].split(whitespaceSeparator);
  if (matrixLine.length !== 1) throw new Error(`Invalid matrix marker: ${lines[0]}`);
  if (matrixLine[0].toLowerCase() !== marker) throw new Error(`File must start with ${marker} marker`);

  for (let i = 0; i < graph.order; i++) {
    const lineTokens = lines[i + 1].split(whitespaceSeparator);
    for (let j = 0; j < i; j++) {
      if (lineTokens[j] === '1') graph.addEdge(i + 1, j + 1);
    }
  }
}
