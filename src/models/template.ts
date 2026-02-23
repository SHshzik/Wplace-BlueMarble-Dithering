import TemplateTile, { StoredTile } from './template_tile';
import ColorSet, { StoredColorSet } from './color_set';
import TileCoords, { StoredTileCoords } from './tile_coords';

export interface StoredTemplate {
  tiles: StoredTile[];
  colorSet: StoredColorSet[];
  tileCoords: StoredTileCoords[];
}

export default class Template {
  tiles: TemplateTile[];
  colorSet: ColorSet[];
  tileCoords: TileCoords[];

  static fromStored(stored: StoredTemplate): Template {
    const tiles = stored.tiles.map(TemplateTile.fromStored);
    const colorSet = (stored.colorSet ?? []).map(ColorSet.fromStored);
    const tileCoords = (stored.tileCoords ?? []).map(TileCoords.fromStored);
    return new Template(tiles, colorSet, tileCoords);
  }

  constructor(
    tiles: TemplateTile[],
    colorSet: ColorSet[],
    tileCoords: TileCoords[],
  ) {
    this.tiles = tiles;
    this.colorSet = colorSet;
    this.tileCoords = tileCoords;
  }

  static uniqueTileCoordsFromTiles(tiles: TemplateTile[]): TileCoords[] {
    const set = new Set<string>();
    for (const t of tiles) {
      set.add(`${t.tileX},${t.tileY}`);
    }
    return Array.from(set).map((s) => {
      const [x, y] = s.split(',').map(Number);
      return new TileCoords(x, y);
    });
  }

  hasTile(tileX: number, tileY: number): boolean {
    return this.tileCoords.some((tc) => tc.x === tileX && tc.y === tileY);
  }

  getTilesOn(tileX: number, tileY: number): TemplateTile[] {
    return this.tiles.filter((t) => t.tileX === tileX && t.tileY === tileY);
  }

  toStored(): StoredTemplate {
    return {
      tiles: this.tiles.map((t) => t.toStored()),
      colorSet: this.colorSet.map((c) => c.toStored()),
      tileCoords: this.tileCoords.map((tc) => tc.toStored()),
    };
  }
}
