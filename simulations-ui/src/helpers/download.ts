import { Sigma } from 'sigma';

export default async function saveAsPNG(renderer: Sigma) {
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