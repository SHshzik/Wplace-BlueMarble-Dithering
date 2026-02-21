import styles from './overlay.module.css'
import Header from './header/header';
import Info from "./info/info.tsx";
import Colors from './colors/colors.tsx';
import Coordinates from "./coordinates/coordinates.tsx";
import { Component } from "preact";

export default class Overlay extends Component{
  render() {
    return (
      <div className={ styles.bmOverlay } style={ {top: 10, right: 50} }>
        <Header />
        <hr />
        <Info />
        <hr />
        <Coordinates />
        <hr />
        <Colors />
      </div>
    );
  }
}
