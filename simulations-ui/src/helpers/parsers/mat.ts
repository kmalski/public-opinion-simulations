import { Graph } from '@/helpers/types';
import { newlineSeparator, whitespaceSeparator } from '@/helpers/parsers/common';
import { parseVertices, serializeVertices } from '@/helpers/parsers/pajek';

export function serializeMat(graph: Graph, withPositions: boolean): string {
  const res = serializeVertices(graph, withPositions);
  let { result } = res;

  result += '*Matrix\n';
  for (const node of res.nodes) {
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

export function parseMat(fileText: string): Graph {
  const graph = new Graph();

  const lines = fileText.split(newlineSeparator);
  if (lines.length === 0) return graph;

  const remainingLines = parseVertices(graph, lines);
  if (!remainingLines) throw new Error('Missing matrix definition');
  parseMatrix(graph, remainingLines);

  return graph;
}

function parseMatrix(graph: Graph, lines: string[]) {
  const marker = '*matrix';

  const matrixLine = lines[0].split(whitespaceSeparator);
  if (matrixLine.length !== 1) throw new Error(`Invalid matrix marker: ${lines[0]}`);
  if (matrixLine[0].toLowerCase() !== marker) throw new Error(`File must contains section with ${marker} marker`);

  const matrix = readMatrix(graph, lines.slice(1, graph.order + 1));
  for (let i = 0; i < graph.order; i++) {
    for (let j = 0; j < i; j++) {
      const val = matrix[i][j];
      if (val !== matrix[j][i]) throw new Error('Adjacency matrix must be symmetric');
      if (val === '1') graph.addEdge(i + 1, j + 1);
    }
  }
}

function readMatrix(graph: Graph, lines: string[]): string[][] {
  const matrix = [];
  for (const line of lines) {
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
