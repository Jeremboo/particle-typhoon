import {
  Vector3,
} from 'three';

import engine from 'core/engine';
import gui from 'core/gui';
import loop from 'core/loop';
import { loadAssets } from 'core/assetLoader';
import { ease } from 'core/utils';
import props from 'core/props';

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

  // MOVE CAMERA
  let t = 6;
  let dist = props.BASE_DIST;
  ease(props.EASE_DURATION, (easing) => {
    dist -= (dist - props.TARGETED_POSITION.dist) * easing;
    engine.webgl.camera.position.y -= (engine.webgl.camera.position.y - props.TARGETED_POSITION.y) * easing;
    engine.webgl.scene.fog.far -= (engine.webgl.scene.fog.far - props.FOG_FAR) * easing;
  });

  const cameraCoord = document.getElementById('camera-coord');
  loop.add('camera', () => {
    t += props.ROTATION_SPEED;
    engine.webgl.camera.position.x = Math.cos(t) * dist;
    engine.webgl.camera.position.z = Math.sin(t) * dist;
    engine.webgl.camera.lookAt(new Vector3(0, props.LOOK_AT, 0));

    // HELPER camera position
    if (engine.debugCamera) {
      const { x, y, z } = engine.debugCamera.position;
      cameraCoord.innerHTML = `{ x: ${x}, y: ${y}, z: ${z} }`;
    }
  });

}).catch((e) => {
  // TODO show error webgl not supported
  throw (e);
});
