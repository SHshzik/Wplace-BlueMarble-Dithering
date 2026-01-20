import Logger from './services/logger';
import {Overlay} from "./ui/Overlay";
import {render} from "lit-html";
import styles from './ui.module.css?inline';

const appName = 'New Red Marble'
const logger = new Logger([appName]);

logger.info('Application started');

render(Overlay(), document.body);

// if (process.env.BUILD_MODE === 'dev') {
//     // inline уже вставлен плагином, можно ничего не делать
// } else {
//     // подключаем через @resource GM_getResourceURL
// }
