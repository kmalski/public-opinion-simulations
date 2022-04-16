import { Sigma } from 'sigma';
import { Graph } from '@/helpers/types';
import { Graph as Graphviz, toDot } from 'ts-graphviz';
import { write as gexfWrite } from 'graphology-gexf';

export function saveAsDot(graph: Graph, filename: string, withPositions = false) {
  const graphviz = new Graphviz();
  graph.forEachNode((node, attributes) => {
    const attr = {
      label: attributes.label,
      pos: withPositions ? `${attributes.x},${attributes.y}!` : undefined
    };
    graphviz.createNode(node, attr);
  });

  graph.forEachEdge((edge, attributes, source, target) => {
    graphviz.createEdge([source, target]);
  });

  const graphStr = toDot(graphviz);
  saveBlob(strToBlob(graphStr), filename + '.dot');
}

export function saveAsJson(graph: Graph, filename: string, withPositions = false) {
  const graphCopy = graph.copy();
  graphCopy.forEachNode((node, attributes) => {
    attributes.size = undefined;
    attributes.color = undefined;
    attributes.x = withPositions ? attributes.x : undefined;
    attributes.y = withPositions ? attributes.y : undefined;
  });
  const graphStr = JSON.stringify(graphCopy.export());

  saveBlob(strToBlob(graphStr), filename + '.json');
}

export function saveAsGexf(graph: Graph, filename: string, withPositions = false) {
  const graphStr = gexfWrite(graph, {
    pretty: true,
    formatNode: (key, attributes) => {
      return {
        label: attributes.label,
        viz: withPositions ? { x: attributes.x, y: attributes.y } : undefined
      };
    },
    formatEdge: () => {
      return {};
    }
  });

  saveBlob(strToBlob(graphStr), filename + '.gexf');
}

export async function saveAsPng(renderer: Sigma) {
  const { width, height } = renderer.getDimensions();

  const pixelRatio = window.devicePixelRatio || 1;

  const tmpRoot = document.createElement('div') as HTMLDivElement;
  tmpRoot.style.width = `${width}px`;
  tmpRoot.style.height = `${height}px`;
  tmpRoot.style.position = 'absolute';
  tmpRoot.style.right = '101%';
  tmpRoot.style.bottom = '101%';
  document.body.appendChild(tmpRoot);

  const tmpRenderer = new Sigma(renderer.getGraph(), tmpRoot, renderer.getSettings());

  tmpRenderer.getCamera().setState(renderer.getCamera().getState());
  tmpRenderer.refresh();

  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.setAttribute('width', width * pixelRatio + '');
  canvas.setAttribute('height', height * pixelRatio + '');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width * pixelRatio, height * pixelRatio);

  // For each layer, draw it on our canvas:
  const canvases = tmpRenderer.getCanvases();
  const layers = ['edges', 'nodes', 'labels'];
  layers.forEach((id) => {
    ctx.drawImage(
      canvases[id],
      0,
      0,
      width * pixelRatio,
      height * pixelRatio,
      0,
      0,
      width * pixelRatio,
      height * pixelRatio
    );
  });

  // Save the canvas as a PNG image:
  canvas.toBlob((blob) => {
    if (blob) saveBlob(blob, 'graph.png');

    tmpRenderer.kill();
    tmpRoot.remove();
  }, 'image/png');
}

function saveBlob(blob: Blob, name: string) {
  const link = document.createElement('a') as HTMLAnchorElement;
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

function strToBlob(str: string): Blob {
  return new Blob([str], {
    type: 'text/plain'
  });
}
