import { BinaryOpinion, Graph, NodeAttributes } from '@/helpers/types';
import { NODE_SIZE } from '@/helpers/defaults';
import { opinionToColor } from '@/helpers/graph';

export function parseLabel(label: string | number | boolean): BinaryOpinion {
  if (!label) {
    throw new Error(`Missing required attribute 'label'`);
  }

  let num;
  if (typeof label === 'string') {
    num = +label;
  } else if (typeof label === 'boolean') {
    num = label ? 1 : -1;
  } else {
    num = label;
  }
  if (num !== -1 && num !== 1) {
    throw new Error(`Attribute 'label' has invalid value: ${label}`);
  }

  return num > 0 ? '1' : '-1';
}

export function serializePos(pos: number | undefined): string | undefined {
  return pos?.toFixed(4);
}

export function addNodesCount(graph: Graph, count: number) {
  for (let i = 1; i < count + 1; i++)
    graph.addNode(i, {
      size: NODE_SIZE
    });
}

export function addNodes(graph: Graph, lines: string[]) {
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

export const whitespaceSeparator = / +/;
export const newlineSeparator = /\r?\n/;
