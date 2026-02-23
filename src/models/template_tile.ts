import { base64ToUint8 } from '../utils/base64';

export interface StoredTile {
  tileX: number;
  tileY: number;
  pixelX: number;
  pixelY: number;
  buffer: string;
}

export default class TemplateTile {
  tileX: number;
  tileY: number;
  pixelX: number;
  pixelY: number;
  blob: Blob;
  buffer: string;

  static fromStored(item: StoredTile): TemplateTile {
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
  }

  constructor(
    tileX: number,
    tileY: number,
    pixelX: number,
    pixelY: number,
    blob: Blob,
    buffer: string
  ) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.pixelX = pixelX;
    this.pixelY = pixelY;
    this.blob = blob;
    this.buffer = buffer;
  }

  toStored(): StoredTile {
    return {
      tileX: this.tileX,
      tileY: this.tileY,
      pixelX: this.pixelX,
      pixelY: this.pixelY,
      buffer: this.buffer,
    };
  }
}
