import engine from 'core/engine';

import {
  AmbientLight,
} from 'three';

import Exemple from 'objects/Exemple';


// TODO show loader
engine.init().then(() => {

  // TODO load Assets

  // TODO Init objects
 // LIGHT
  const ambiantLight = new AmbientLight(0xffffff, 0.5);
  engine.webgl.add(ambiantLight);

  // OBJECTS
  const exemple = new Exemple();
  engine.webgl.add(exemple);


  // TODO Helpers
  engine.onToggleHelper((enabled) => {
    if (enabled) {
      // const lightHelper = new PointLightHelper(this.lights[i], 10);
      // engine.gui.addLight(lightHelper);
      // engine.webgl.add(lightsHelper);
    } else {
      // engine.webgl.remove(lightHelper);
    }
  });

  // TODO hide loader
}).catch((e) => {
  // TODO show error webgl not supported
  console.log(e);
});
