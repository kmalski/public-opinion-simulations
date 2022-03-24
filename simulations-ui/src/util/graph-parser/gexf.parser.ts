import Graph from 'graphology';
import { parse } from 'graphology-gexf';

export async function parseGexf(fileUrl: RequestInfo): Promise<Graph> {
  const file = await fetch(fileUrl);
  const gexf = await file.text();
  return parse(Graph, gexf);
}
