import { Component } from "preact";
import { bmContainHeader, bmBarDrag } from './header.module.css';

export default class Header extends Component {
  render() {
    return (
      <div class={bmContainHeader}>
        <div class={bmBarDrag}></div>
        <h1>Red Marble New</h1>
      </div>
    );
  }
}
