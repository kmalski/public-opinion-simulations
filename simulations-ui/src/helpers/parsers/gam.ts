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
  const matrix = buildMatrix(graph, lines);

  for (let i = 0; i < graph.order; i++) {
    for (let j = 0; j < i; j++) {
      const val = matrix[i][j];
      if (val !== matrix[j][i]) throw new Error('Adjacency matrix must be symmetric');
      if (val === '1') graph.addEdge(i + 1, j + 1);
    }
  }
}

function buildMatrix(graph: Graph, lines: string[]): string[][] {
  const marker = 'matrix';

  const matrixLine = lines[0].split(whitespaceSeparator);
  if (matrixLine.length !== 1) throw new Error(`Invalid matrix marker: ${lines[0]}`);
  if (matrixLine[0].toLowerCase() !== marker) throw new Error(`File must contains section with ${marker} marker`);

  const matrix = [];
  for (const line of lines.slice(1, graph.order + 1)) {
    if (!line) throw new Error('Matrix line can not be empty');

    const lineTokens = line.split(whitespaceSeparator);
    if (!lineTokens.every((token) => token === '0' || token === '1'))
      throw new Error('Matrix contains invalid value, only 1 and 0 are allowed');

    checkMatrixSize(lineTokens.length, graph.order);
    matrix.push(lineTokens);
  }

  checkMatrixSize(matrix.length, graph.order);
  return matrix;
}

function checkMatrixSize(length: number, expectedLength: number) {
  if (length != expectedLength) throw new Error(`Matrix size is different than defined: ${expectedLength}`);
}
