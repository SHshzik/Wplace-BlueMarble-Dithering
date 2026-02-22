import { Component } from "preact";

import styles from './header.module.css';

export default class Header extends Component {
  render() {
    return (
      <div class={styles.bmContainHeader}>
        <div class={styles.bmBarDrag}></div>
        <h1>Red Marble New</h1>
      </div>
    );
  }
}
