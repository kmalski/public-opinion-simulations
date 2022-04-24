import { MultiUndirectedGraph } from 'graphology';
import { Attributes } from 'graphology-types';

// better typing for stores with usage of storeToRefs
export type Optional<T> = T | undefined;

export interface GraphAttributes extends Attributes {
  predefinedPositions: boolean;
}

export interface NodeAttributes extends Attributes {
  size?: number;
  color?: string;
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
