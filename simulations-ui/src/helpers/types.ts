import GraphologyGraph from 'graphology';
import { Attributes } from 'graphology-types';

export type Optional<T> = T | null;

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

export class Graph<EdgeAttributes extends Attributes = Attributes> extends GraphologyGraph<
  NodeAttributes,
  EdgeAttributes,
  GraphAttributes
> {}
