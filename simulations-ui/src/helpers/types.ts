import { UndirectedGraph } from 'graphology';
import { Attributes, SerializedGraph } from 'graphology-types';

export type Color = `#${string}`;

// better typing for stores with usage of storeToRefs
export type Optional<T> = T | undefined;

export interface GraphAttributes extends Attributes {
  predefinedPositions?: boolean;
}

export interface NodeAttributes extends Attributes {
  size?: number;
  color?: Color;
  label?: string;
  x?: number;
  y?: number;
  num?: number;
}

export type EdgeAttributes = Attributes;

export class Graph extends UndirectedGraph<NodeAttributes, EdgeAttributes, GraphAttributes> {
  constructor() {
    super({ allowSelfLoops: false, multi: false, type: 'undirected' });
  }

  static create(data: SerializedGraph<NodeAttributes, EdgeAttributes, GraphAttributes>): Graph {
    const graph = new Graph();
    graph.import(data, false);
    return graph;
  }

  isComplete(): boolean {
    return this.size == (this.order * (this.order - 1)) / 2;
  }
}

export type BinaryOpinion = '-1' | '1';
