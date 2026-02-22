import { render } from 'preact';

import Overlay from './ui/overlay';
import { TemplateManager, TemplateManagerContext } from './services/template_manger';
import CurrentCoordsManager from './services/coords_manager';

import './services/spy';
import './services/render';

const currentCoordsManager = new CurrentCoordsManager();
const templateManager = new TemplateManager(currentCoordsManager);

function App() {
  return (
    <TemplateManagerContext.Provider
      value={{
        coords: currentCoordsManager.getCurrentCoordsSignal(),
        setCoords: currentCoordsManager.createSetterForCurrentCoordinates(),
        createTemplate: templateManager.createTemplateFunc(),
      }}
    >
      <Overlay />
    </TemplateManagerContext.Provider>
  );
}

render(
  <App />,
  (() => {
    const app = document.createElement('div');
    document.body.append(app);
    return app;
  })(),
);
