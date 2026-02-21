import { render } from 'preact';
import Overlay from './ui/overlay';

import './services/spy';
import './services/render';

render(
  <Overlay />,
  (() => {
    const app = document.createElement('div');
    document.body.append(app);
    return app;
  })(),
);
