import {
  PlaneBufferGeometry, MeshStandardMaterial, Mesh,
} from 'three';

import engine from 'core/engine';
import gui from 'core/gui';
import { radians } from 'core/utils';
import { loadAssets } from 'core/assetLoader';

import lights from 'objects/Lights';
import Typhoon from 'objects/Typhoon';


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
  const planeGeometry = new PlaneBufferGeometry(400, 400, 32, 32);
  const planeMaterial = new MeshStandardMaterial();
  const plane = new Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = radians(-90);
  plane.receiveShadow = true;
  engine.webgl.scene.add(plane);

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
}).catch((e) => {
  // TODO show error webgl not supported
  throw (e);
});
