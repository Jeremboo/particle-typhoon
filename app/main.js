import {
  Vector3,
} from 'three';

import engine from 'core/engine';
import gui from 'core/gui';
import loop from 'core/loop';
import { loadAssets } from 'core/assetLoader';
import { ease } from 'core/utils';

import lights from 'objects/Lights';
import Typhoon from 'objects/Typhoon';
import Plane from 'objects/Plane';


// TODO show loader

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

  // TODO hide loader

  // MOVE CAMERA
  let t = 0;
  let dist = 50;
  const baseCameraPos = engine.webgl.camera.position.clone();
  ease(4, (easing) => {
    dist = 50 + ((20 - 50) * easing);
    engine.webgl.camera.position.y = baseCameraPos.y + ((5 - baseCameraPos.y) * easing);
  });

  loop.add('rotation', () => {
    t += 0.004;
    engine.webgl.camera.position.x = Math.cos(t) * dist;
    engine.webgl.camera.position.z = Math.sin(t) * dist;
    engine.webgl.camera.lookAt(new Vector3(0, 0, 0));
  });
}).catch((e) => {
  // TODO show error webgl not supported
  throw (e);
});
