import type { TemplateManager } from './template_manger';

function parseTileCoordsFromEndpoint(
  endpoint: string,
): [number, number] | null {
  let tileCoordsTile = endpoint.split('/');
  return [
    parseInt(tileCoordsTile[tileCoordsTile.length - 2], 10),
    parseInt(tileCoordsTile[tileCoordsTile.length - 1].replace('.png', ''), 10),
  ];
}

export async function initImagePipeline(
  templateManager: TemplateManager,
): Promise<void> {
  const drawSize = templateManager.getTileSize() * 3;

  window.addEventListener('message', async (event: MessageEvent) => {
    const { type, blobID, blob, endpoint } = event.data ?? {};

    if (type !== 'image-request') return;

    const tileBitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(drawSize, drawSize);
    const context = canvas.getContext('2d');
    if (!context) {
      tileBitmap.close();
      window.postMessage(
        {
          type: 'image-ready',
          blobID,
          normalizedData: blob,
          endpoint: 'ignore',
        },
        '*',
      );
      return;
    }

    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, drawSize, drawSize);
    context.drawImage(tileBitmap, 0, 0, drawSize, drawSize);
    tileBitmap.close();

    const coords = parseTileCoordsFromEndpoint(endpoint ?? '');
    if (coords) {
      const [tileX, tileY] = coords;
      const templateTiles = templateManager.getTilesForTile(tileX, tileY);
      for (const templateTile of templateTiles) {
        const templateTileBitmap = await createImageBitmap(templateTile.blob);
        context.drawImage(
          templateTileBitmap,
          templateTile.pixelX * 3,
          templateTile.pixelY * 3,
        );
        templateTileBitmap.close();
      }
    }

    const normalizedData = await canvas.convertToBlob({ type: 'image/png' });

    window.postMessage(
      {
        type: 'image-ready',
        blobID,
        normalizedData,
        endpoint: 'ignore',
      },
      '*',
    );
  });
}
