import { createContext } from 'preact';
import { Signal } from '@preact/signals';
import { GM_getValue, GM_setValue } from '$';

import Logger from './logger';
import Coords from '../models/coords';
import CurrentCoordsManager from './coords_manager';
import Template, { StoredTemplate } from '../models/template';
import TemplateTile from '../models/template_tile';
import ColorSet from '../models/color_set';
import { uint8ToBase64 } from '../utils/base64';

import colorPalette from '../data/color_palette.json';

type PaletteEntry = { id: number; rgb: number[] };
const palette = colorPalette as PaletteEntry[];

export class TemplateManager {
  private readonly imageScaleFactor = 3;
  private readonly logger = new Logger(['TemplateManager']);
  private readonly tileSize = 1000;
  private currentCoordsManager: CurrentCoordsManager;
  private templates: Template[] = [];

  constructor(currentCoordsManager: CurrentCoordsManager) {
    this.currentCoordsManager = currentCoordsManager;

    const stored = GM_getValue('templates', '[]');
    try {
      const parsed = JSON.parse(stored) as StoredTemplate[];
      this.templates = parsed.map(Template.fromStored);
    } catch {
      this.templates = [];
    }
  }

  createTemplateFunc() {
    return async (file: File): Promise<void> => {
      await this.createTemplate(file);
      this.storeTemplateTiles();
    };
  }

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

    const colorCounts = new Map<number, number>();
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
            const isCenterPixel = x % scale === 1 && y % scale === 1;
            const i = (y * canvasWidth + x) * 4;
            if (isCenterPixel) {
              const colorId = findColorId(data[i], data[i + 1], data[i + 2]);
              colorCounts.set(colorId, (colorCounts.get(colorId) ?? 0) + 1);
            } else {
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

    const colorSet: ColorSet[] = Array.from(colorCounts.entries()).map(
      ([colorId, pixelCount]) => new ColorSet(colorId, pixelCount),
    );
    const tileCoords = Template.uniqueTileCoordsFromTiles(results);

    this.templates = [new Template(results, colorSet, tileCoords)];
  }

  getColorSetSignal(): Signal<ColorSet[]> | null {
    return this.templates[0]?.colorSet ?? null;
  }

  getTileSize(): number {
    return this.tileSize;
  }

  getImageScaleFactor(): number {
    return this.imageScaleFactor;
  }

  getTilesForTile(tileX: number, tileY: number): TemplateTile[] {
    const result: TemplateTile[] = [];
    for (const template of this.templates) {
      if (!template.hasTile(tileX, tileY)) continue;
      for (const tile of template.getTilesOn(tileX, tileY)) {
        result.push(tile);
      }
    }
    return result;
  }

  storeTemplateTiles(): void {
    const toStore: StoredTemplate[] = this.templates.map((t) => t.toStored());
    GM_setValue('templates', JSON.stringify(toStore));
  }
}

interface TemplateManagerContextValue {
  coords: Signal<Coords>;
  setCoords: (coords: Coords) => void;
  createTemplate: (file: File) => void;
  colorSetSignal: Signal<ColorSet[]> | null;
}

export const TemplateManagerContext =
  createContext<TemplateManagerContextValue | null>(null);

function findColorId(r: number, g: number, b: number): number {
  return (
    palette.find((c) => c.rgb[0] === r && c.rgb[1] === g && c.rgb[2] === b)
      ?.id ?? -1
  );
}
