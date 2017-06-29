import engine from 'core/engine';

import {
  AmbientLight,
} from 'three';

import { loadAssets } from 'core/assetLoader';
import Typhoon from 'objects/Typhoon';


// TODO show loader

engine.init().then(() => loadAssets).then(() => {
  /** ****************
  * INIT OBJECT
  ******************/

  // LIGHT
  const ambiantLight = new AmbientLight(0xffffff, 0.5);
  engine.webgl.add(ambiantLight);

  // OBJECTS
  const typhoon = new Typhoon();
  engine.webgl.add(typhoon);

  /** ****************
  * INIT HELPERS
  ******************/
  engine.onToggleHelper((enabled) => {
    if (enabled) {
      // const lightHelper = new PointLightHelper(this.lights[i], 10);
      // engine.gui.addLight(lightHelper);
      // engine.webgl.add(lightsHelper);
    } else {
      // engine.webgl.remove(lightHelper);
    }
  });

  /** ****************
  * START
  ******************/
  engine.start();
  // TODO hide loader
}).catch((e) => {
  // TODO show error webgl not supported
  throw (e);
});
