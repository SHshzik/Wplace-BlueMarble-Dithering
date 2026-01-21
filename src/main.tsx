import { render } from 'preact';
import { Overlay } from './ui/overlay';

import './services/spy';

render(
  <Overlay />,
  (() => {
    const app = document.createElement('div');
    document.body.append(app);
    return app;
  })(),
);
