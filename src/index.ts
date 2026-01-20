import Logger from './services/logger';
import {Overlay} from "./ui/Overlay";
import {render} from "lit-html";
import styles from './ui.module.css?inline';

const appName = 'New Red Marble'
const logger = new Logger([appName]);

logger.info('Application started');

// Imports the CSS file from dist folder on github
const cssOverlay = GM_getResourceText("CSS-BM-File");
GM_addStyle(cssOverlay);

render(Overlay(), document.body);
