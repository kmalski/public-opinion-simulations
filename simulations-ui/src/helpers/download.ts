import { Sigma } from 'sigma';
import { Graph } from '@/helpers/types';
import { serializeDot, serializeGexf, serializeJson, serializeNet, serializeMat } from '@/helpers/parsers';

export function saveAsMat(graph: Graph, filename: string, withPositions = false) {
  const graphStr = serializeMat(graph, withPositions);
  saveBlob(strToBlob(graphStr), filename + '.mat');
}

export function saveAsNet(graph: Graph, filename: string, withPositions = false) {
  const graphStr = serializeNet(graph, withPositions);
  saveBlob(strToBlob(graphStr), filename + '.net');
}

export function saveAsDot(graph: Graph, filename: string, withPositions = false) {
  const graphStr = serializeDot(graph, withPositions);
  saveBlob(strToBlob(graphStr), filename + '.dot');
}

export function saveAsJson(graph: Graph, filename: string, withPositions = false) {
  const graphStr = serializeJson(graph, withPositions);
  saveBlob(strToBlob(graphStr), filename + '.json');
}

export function saveAsGexf(graph: Graph, filename: string, withPositions = false) {
  const graphStr = serializeGexf(graph, withPositions);
  saveBlob(strToBlob(graphStr), filename + '.gexf');
}

export async function saveAsJpg(renderer: Sigma) {
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
    if (blob) saveBlob(blob, 'graph.jpg');

    tmpRenderer.kill();
    tmpRoot.remove();
  }, 'image/jpeg');
}

export function saveBlob(blob: Blob, name: string) {
  saveUrl(URL.createObjectURL(blob), name);
}

export function saveUrl(url: string, name: string) {
  const link = document.createElement('a') as HTMLAnchorElement;
  link.href = url;
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
