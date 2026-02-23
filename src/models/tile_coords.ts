export type StoredTileCoords = [number, number];

export default class TileCoords {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static fromStored(stored: StoredTileCoords): TileCoords {
    return new TileCoords(stored[0], stored[1]);
  }

  toStored(): StoredTileCoords {
    return [this.x, this.y];
  }
}
