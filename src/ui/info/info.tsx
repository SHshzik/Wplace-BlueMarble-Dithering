import { Component } from 'preact';

import parseEndpoint from '../../utils/endpoint';

import styles from './info.module.css';

interface InfoState {
  username: string;
  droplets: number;
  nextLevelPixels: number;
}

export default class Info extends Component {
  state: InfoState = {username: '', droplets: 0, nextLevelPixels: 0};

  constructor() {
    super();
  }

  componentDidMount() {
    // this.updateFullChargeInfo(overlay, dataJSON)
    window.addEventListener('message', async (event) => {
      const endpointText = parseEndpoint(event.data.endpoint);

      if (endpointText === 'me') {
        const { data: { data: { name, droplets, level, pixelsPainted } } } = event
        const nextLevelPixels: number = Math.ceil(Math.pow(Math.floor(level) * Math.pow(30, 0.65), (1 / 0.65)) - pixelsPainted);

        this.setState({username: name, droplets: droplets, nextLevelPixels: nextLevelPixels});
      }
    });
  }

  render() {
    return (
      <div class={ styles.bmContainUserInfo }>
        <p>Username: <b>{ this.state.username }</b></p>
        <p>Droplets: <b>{ new Intl.NumberFormat().format(this.state.droplets) }</b></p>
        <p>Next level in... <b>{ new Intl.NumberFormat().format(this.state.nextLevelPixels) }</b> pixel{this.state.nextLevelPixels == 1 ? '' : 's'}</p>
        <div>
          <p>Full Charge in... </p>
        </div>
      </div>
    );
  }
}
