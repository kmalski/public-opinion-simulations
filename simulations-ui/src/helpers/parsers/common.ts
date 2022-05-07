import { BinaryOpinion } from '@/helpers/types';

export function parseLabel(label: string | number | boolean | undefined): BinaryOpinion {
  if (!label) throw new Error(`Missing required attribute 'label'`);
  if (typeof label === 'string') return +label > 0 ? '1' : '-1';
  if (typeof label === 'boolean') return label ? '1' : '-1';
  return label > 0 ? '1' : '-1';
}
