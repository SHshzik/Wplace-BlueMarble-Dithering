import { Component } from 'preact';
import { bmContainUserInfo } from './info.module.css';

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
      const endpointText = event.data.endpoint
        .split('?')[0]
        .split('/')
        .filter((s: string) => s && isNaN(Number(s)))
        .filter((s: string) => s && !s.includes('.'))
        .pop();

      if (endpointText === 'me') {
        const { data: { data: { name, droplets, level, pixelsPainted } } } = event
        const nextLevelPixels: number = Math.ceil(Math.pow(Math.floor(level) * Math.pow(30, 0.65), (1 / 0.65)) - pixelsPainted);

        this.setState({username: name, droplets: droplets, nextLevelPixels: nextLevelPixels});
      }
    });
  }

  render() {
    return (
      <div class={ bmContainUserInfo }>
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
