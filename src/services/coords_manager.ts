import { GM_getValue, GM_setValue } from "$";
import { signal, Signal } from '@preact/signals';

import Coords from "../models/coords";
import Logger from './logger';

export default class CurrentCoordsManager {
  private logger = new Logger(['CurrentCoordsManager'])
  private currentCoordsSignal: Signal<Coords>;

  constructor() {
    const { tileX = 0, tileY = 0, pixelX = 0, pixelY = 0 } = JSON.parse(GM_getValue('coords', '{}'))
    const coords = new Coords(tileX, tileY, pixelX, pixelY)
    const coordsSignal = signal(coords);
    this.currentCoordsSignal = coordsSignal;
  }

  getCurrentCoordsSignal(): Signal<Coords> {
    return this.currentCoordsSignal;
  }

  createSetterForCurrentCoordinates() {
    return (newCoords: Coords) => {
        this.currentCoordsSignal.value = newCoords;
        GM_setValue('coords', JSON.stringify(newCoords));
    }
  }
}
