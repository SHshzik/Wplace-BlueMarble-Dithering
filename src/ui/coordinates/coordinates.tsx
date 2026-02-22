import { Component } from 'preact';

import styles from './coordinates.module.css';
import messageHandle from "../../utils/message_handle.ts";
import Logger from "../../services/logger.ts";
import Coords from '../../models/coords.ts';
import { TemplateManagerContext } from '../../services/template_manger';

export default class Coordinates extends Component {
  static contextType = TemplateManagerContext;

  private logger = new Logger(['Coordinates'])

  min = 0
  max = 2047
  step = 1
  endpoint = 'pixel'

  componentDidMount(): void {
    messageHandle(this.endpoint, (event) => {
      const { data: { endpoint } } = event

      const coordsTile = endpoint.split('?')[0].split('/').filter((s: string) => s && !isNaN(Number(s)));
      const payloadExtractor = new URLSearchParams(endpoint.split('?')[1]);

      const newCoords = new Coords(Number(coordsTile[0]), Number(coordsTile[1]), Number(payloadExtractor.get('x')), Number(payloadExtractor.get('y')))
      this.context.setCoords(newCoords);
    })
  }

  saveCoords(): void {
    // backward compatibility
  }

  render() {
    return (
      <div>
        <button class={ styles.coordinatesBtn } onClick={() => { this.saveCoords() }}>
          <svg class={ styles.coordinatesSvg } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 6">
            <circle cx="2" cy="2" r="2"></circle>
            <path d="M2 6 L3.7 3 L0.3 3 Z"></path>
            <circle cx="2" cy="2" r="0.7" fill="white"></circle>
          </svg>
        </button>
        <input class={ styles.coordinatesInput } type="number" min={ this.min } max={ this.max } step={ this.step } required value={this.context.coords.value.tileX}/>
        <input class={ styles.coordinatesInput } type="number" min={ this.min } max={ this.max } step={ this.step } required value={this.context.coords.value.tileY}/>
        <input class={ styles.coordinatesInput } type="number" min={ this.min } max={ this.max } step={ this.step } required value={this.context.coords.value.pixelX}/>
        <input class={ styles.coordinatesInput } type="number" min={ this.min } max={ this.max } step={ this.step } required value={this.context.coords.value.pixelY}/>
      </div>
    );
  }
}
