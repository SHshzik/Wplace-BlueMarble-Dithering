import { bmOverlay } from './overlay.module.css'
import Header from './header/header';
import Info from "./info/info.tsx";

export function Overlay() {
  return (
    <div className={ bmOverlay } style={ {top: 10, right: 50} }>
      <Header />
      <hr/>
      <Info />
    </div>
  );
}
