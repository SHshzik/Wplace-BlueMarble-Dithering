export default class TemplateTile {
  tileX: number;
  tileY: number;
  pixelX: number;
  pixelY: number;
  blob: Blob;
  buffer: string;

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
}
