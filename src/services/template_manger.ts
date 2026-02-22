import { createContext } from 'preact';
import { Signal } from '@preact/signals';

import Logger from './logger';
import Coords from '../models/coords';
import CurrentCoordsManager from './coords_manager';
import TemplateTile from '../models/template_tile';
import { base64ToUint8, uint8ToBase64 } from '../utils/base64';
import { GM_getValue, GM_setValue } from '$';

export class TemplateManager {
  private logger = new Logger(['TemplateManager']);
  private tileSize = 1000;
  private currentCoordsManager: CurrentCoordsManager;
  private templateTiles: TemplateTile[] = [];

  constructor(currentCoordsManager: CurrentCoordsManager) {
    this.currentCoordsManager = currentCoordsManager;
    const stored = GM_getValue('templates', '[]');
    try {
      const parsed = JSON.parse(stored) as Array<{
        tileX: number;
        tileY: number;
        pixelX: number;
        pixelY: number;
        buffer: string;
      }>;
      this.templateTiles = parsed.map((item) => {
        const bytes = base64ToUint8(item.buffer);
        const blob = new Blob([bytes], { type: 'image/png' });
        return new TemplateTile(
          item.tileX,
          item.tileY,
          item.pixelX,
          item.pixelY,
          blob,
          item.buffer,
        );
      });
    } catch {
      this.templateTiles = [];
    }
  }

  createTemplateFunc() {
    return async (file: File): Promise<void> => {
      await this.createTemplate(file);
      this.storeTemplateTiles();
    };
  }

  private readonly imageScaleFactor = 3;
  async createTemplate(file: File): Promise<void> {
    const coords = this.currentCoordsManager.getCurrentCoordsSignal().value;
    const bitmap = await createImageBitmap(file);
    const imageWidth = bitmap.width;
    const imageHeight = bitmap.height;

    const [baseTileX, baseTileY, basePixelX, basePixelY] = [
      coords.tileX,
      coords.tileY,
      coords.pixelX,
      coords.pixelY,
    ];

    const results: TemplateTile[] = [];
    const canvas = new OffscreenCanvas(this.tileSize, this.tileSize);
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Could not get canvas 2d context');

    context.imageSmoothingEnabled = false;

    const scale = this.imageScaleFactor;

    for (let pixelY = basePixelY; pixelY < imageHeight + basePixelY; ) {
      const drawSizeY = Math.min(
        this.tileSize - (pixelY % this.tileSize),
        imageHeight - (pixelY - basePixelY),
      );

      for (let pixelX = basePixelX; pixelX < imageWidth + basePixelX; ) {
        const drawSizeX = Math.min(
          this.tileSize - (pixelX % this.tileSize),
          imageWidth - (pixelX - basePixelX),
        );

        const canvasWidth = drawSizeX * scale;
        const canvasHeight = drawSizeY * scale;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.drawImage(
          bitmap,
          pixelX - basePixelX,
          pixelY - basePixelY,
          drawSizeX,
          drawSizeY,
          0,
          0,
          canvasWidth,
          canvasHeight,
        );

        const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
        const data = imageData.data;
        for (let y = 0; y < canvasHeight; y++) {
          for (let x = 0; x < canvasWidth; x++) {
            const isCenterPixel = (x % scale === 1) && (y % scale === 1);
            if (!isCenterPixel) {
              const i = (y * canvasWidth + x) * 4;
              data[i + 3] = 0;
            }
          }
        }
        context.putImageData(imageData, 0, 0);

        const tileX = baseTileX + Math.floor(pixelX / this.tileSize);
        const tileY = baseTileY + Math.floor(pixelY / this.tileSize);
        const pixelInTileX = pixelX % this.tileSize;
        const pixelInTileY = pixelY % this.tileSize;

        const blob = await canvas.convertToBlob({ type: 'image/png' });
        const buffer = await blob.arrayBuffer();
        const bufferBytes = Array.from(new Uint8Array(buffer));
        const base64Blob = uint8ToBase64(bufferBytes);

        results.push(
          new TemplateTile(
            tileX,
            tileY,
            pixelInTileX,
            pixelInTileY,
            blob,
            base64Blob,
          ),
        );

        pixelX += drawSizeX;
      }

      pixelY += drawSizeY;
    }

    bitmap.close();

    this.templateTiles = results;
  }

  getTileSize(): number {
    return this.tileSize;
  }

  getImageScaleFactor(): number {
    return this.imageScaleFactor;
  }

  getTilesForTile(tileX: number, tileY: number): TemplateTile[] {
    return this.templateTiles.filter(
      (t) => t.tileX === tileX && t.tileY === tileY
    );
  }

  storeTemplateTiles(): void {
    const toStore = this.templateTiles.map((t) => ({
      tileX: t.tileX,
      tileY: t.tileY,
      pixelX: t.pixelX,
      pixelY: t.pixelY,
      buffer: t.buffer,
    }));
    GM_setValue('templates', JSON.stringify(toStore));
  }
}

interface TemplateManagerContextValue {
  coords: Signal<Coords>;
  setCoords: (coords: Coords) => void;
  createTemplate: (file: File) => void;
}

export const TemplateManagerContext =
  createContext<TemplateManagerContextValue | null>(null);
