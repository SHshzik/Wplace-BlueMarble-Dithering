import { html, render } from 'lit-html';
import styles from './ui.module.css';

export const Header = () => html`
  <h2 class=${styles.headerTitle}>Hello</h2>
`;

render(Header(), document.body);
