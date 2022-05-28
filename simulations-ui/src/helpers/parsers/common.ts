import { BinaryOpinion } from '@/helpers/types';

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

export const whitespaceSeparator = / +/;
export const newlineSeparator = /\r?\n/;
