export default class Coords {
  tileX: number;
  tileY: number;
  pixelX: number;
  pixelY: number;

  constructor(tileX: number, tileY: number, pixelX: number, pixelY: number) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.pixelX = pixelX;
    this.pixelY = pixelY;
  }
}
