export interface StoredColorSet {
  id: number;
  count: number;
}

export default class ColorSet {
  id: number;
  count: number;

  constructor(id: number, count: number) {
    this.id = id;
    this.count = count;
  }

  static fromStored(stored: StoredColorSet): ColorSet {
    return new ColorSet(stored.id, stored.count);
  }

  toStored(): StoredColorSet {
    return { id: this.id, count: this.count };
  }
}
