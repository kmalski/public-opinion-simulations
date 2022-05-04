import { UndirectedGraph } from 'graphology';
import { Attributes, SerializedGraph } from 'graphology-types';

// better typing for stores with usage of storeToRefs
export type Optional<T> = T | undefined;

export interface GraphAttributes extends Attributes {
  predefinedPositions?: boolean;
}

export interface NodeAttributes extends Attributes {
  size?: number;
  color?: string;
  label: string;
  x?: number;
  y?: number;
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
}

export type BinaryOpinion = '-1' | '1';
