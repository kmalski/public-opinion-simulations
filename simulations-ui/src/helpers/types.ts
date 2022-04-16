import { MultiUndirectedGraph } from 'graphology';
import { Attributes } from 'graphology-types';

export interface GraphAttributes extends Attributes {
  predefinedPositions: boolean;
}

export interface NodeAttributes extends Attributes {
  size: number;
  color: string;
  label: string;
  x?: number;
  y?: number;
}

export class Graph<EdgeAttributes extends Attributes = Attributes> extends MultiUndirectedGraph<
  NodeAttributes,
  EdgeAttributes,
  GraphAttributes
> {}

export type BinaryOpinion = '-1' | '1';
