import { Component } from 'preact';

import messageHandle from '../../utils/message_handle';
import Logger from '../../services/logger';

import styles from './info.module.css';

interface InfoState {
  username: string;
  droplets: number;
  nextLevelPixels: number;
  time: number;
  startTime: number;
  currentCharges: number;
  maxCharges: number;
}

export default class Info extends Component {
  state: InfoState = {
    username: '',
    droplets: 0,
    nextLevelPixels: 0,
    time: 0,
    startTime: 0,
    currentCharges: 0,
    maxCharges: 0,
  };
  logger = new Logger(['Info']);
  timer: number = 0;
  cooldown: number = 30_000;
  endpoint = 'me'

  constructor() {
    super();
  }

  componentDidMount() {
    messageHandle(this.endpoint, (event) => {
      const {data: {data: {name, droplets, level, pixelsPainted, charges: {count, max}}}} = event
      const nextLevelPixels: number = Math.ceil(Math.pow(Math.floor(level) * Math.pow(30, 0.65), (1 / 0.65)) - pixelsPainted);

      this.setState({
        username: name,
        droplets: droplets,
        nextLevelPixels: nextLevelPixels,
        startTime: Date.now(),
        currentCharges: count,
        maxCharges: max,
      });
    })

    this.timer = setInterval(() => {
      this.setState({time: Date.now()})
    }, 1000)
  }

  render() {
    return (
      <div class={ styles.bmContainUserInfo }>
        <p>Username: <b>{ this.state.username }</b></p>
        <p>Droplets: <b>{ new Intl.NumberFormat().format(this.state.droplets) }</b></p>
        <p>Next level
          in... <b>{ new Intl.NumberFormat().format(this.state.nextLevelPixels) }</b> pixel{ this.state.nextLevelPixels == 1 ? '' : 's' }
        </p>
        <div>{ this.fullCharges }</div>
      </div>
    );
  }

  get fullCharges() {
    const elapsed = Date.now() - this.state.startTime;
    const timeToFullMs = (this.state.maxCharges - this.state.currentCharges) * this.cooldown;
    const remainingMs = Math.max(0, timeToFullMs - elapsed);

    const totalSeconds = Math.ceil(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let timeText = '';
    if (hours > 0) {
      timeText = `${ hours }ч ${ minutes }м ${ seconds }с`;
    } else if (minutes > 0) {
      timeText = `${ minutes }м ${ seconds }с`;
    } else {
      timeText = `${ seconds }с`;
    }

    const chargesGained = Math.floor(elapsed / this.cooldown);
    const currentCharges = Math.min(this.state.currentCharges + chargesGained, this.state.maxCharges);
    const chargesText = `${ Math.floor(currentCharges) }/${ this.state.maxCharges }`;

    return (
      <p>
        Full Charge in{ " " }
        <b style="color: #f59e0b;">{ timeText }</b>{ " " }
        <span style="color: #6b7280; font-size: 0.9em;">({ chargesText })</span>
      </p>
    )
  }
}
