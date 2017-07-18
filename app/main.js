import engine from 'core/engine';
import { loadAssets } from 'core/assetLoader';

import loader from 'components/Loader';

import lights from 'objects/Lights';
import Typhoon from 'objects/Typhoon';
import Plane from 'objects/Plane';

import 'style/base.styl';

loader.show();

engine.init().then(() => loadAssets).then(() => {
  /** ****************
  * INIT OBJECT
  ******************/

  // LIGHT
  lights.init();

  // OBJECTS
  const typhoon = new Typhoon();
  engine.webgl.add(typhoon);

  // plane
  const plane = new Plane();
  engine.webgl.add(plane);

  /** ****************
  * INIT HELPERS
  ******************/
  engine.onToggleHelper = (enabled) => {
    lights.toogleHelper(enabled);
    if (enabled) {
    } else {
    }
  };

  /** ****************
  * START
  ******************/
  engine.start();
  loader.hide();

}).catch((e) => {
  // TODO show error webgl not supported
  throw (e);
});
