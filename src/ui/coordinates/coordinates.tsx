import { Component } from "preact";
import styles from './coordinates.module.css';
import messageHandle from "../../utils/message_handle.ts";
import Logger from "../../services/logger.ts";

// TODO: mv state to props for setting coors from places;
interface State {
  tileX: number
  tileY: number
  pixelX: number
  pixelY: number
}

export default class Coordinates extends Component {
  min = 0
  max = 2047
  step = 1
  endpoint = 'pixel'
  logger = new Logger(['Coordinates'])
  state: State = {
    tileX: 0,
    tileY: 0,
    pixelX: 0,
    pixelY: 0
  }

  componentDidMount() {
    messageHandle(this.endpoint, (event) => {
      const { data: { endpoint } } = event

      const coordsTile = endpoint.split('?')[0].split('/').filter((s: string) => s && !isNaN(Number(s)));
      const payloadExtractor = new URLSearchParams(endpoint.split('?')[1]);

      this.setState({
        tileX: coordsTile[0],
        tileY: coordsTile[1],
        pixelX: payloadExtractor.get('x'),
        pixelY: payloadExtractor.get('y')
      })
    })
  }

  render() {
    return (
      <div>
        <button class={ styles.coordinatesBtn }>
          <svg class={ styles.coordinatesSvg } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 6">
            <circle cx="2" cy="2" r="2"></circle>
            <path d="M2 6 L3.7 3 L0.3 3 Z"></path>
            <circle cx="2" cy="2" r="0.7" fill="white"></circle>
          </svg>
        </button>
        <input class={ styles.coordinatesInput } type="number" min={ this.min } max={ this.max } step={ this.step } required value={this.state.tileX}/>
        <input class={ styles.coordinatesInput } type="number" min={ this.min } max={ this.max } step={ this.step } required value={this.state.tileY}/>
        <input class={ styles.coordinatesInput } type="number" min={ this.min } max={ this.max } step={ this.step } required value={this.state.pixelX}/>
        <input class={ styles.coordinatesInput } type="number" min={ this.min } max={ this.max } step={ this.step } required value={this.state.pixelY}/>
      </div>
    );
  }
}
