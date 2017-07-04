import {
  AmbientLight, DirectionalLight,
  DirectionalLightHelper, CameraHelper,
} from 'three';

import engine from 'core/engine';
import gui from 'core/gui';

class Lights {
  constructor() {
    // LIGHT
    this.ambiantLight = false;

    // DIRECTIONNAL LIGHT
    this.directionalLightHelper = false;
    this.directionalLightCameraHelper = false;
    this.directionalLight = false;
  }

  init() {
    // LIGHT
    this.ambiantLight = new AmbientLight(0xffffff, 0.7);
    engine.webgl.add(this.ambiantLight);

    // DIRECTIONNAL LIGHT
    this.directionalLightHelper = false;
    this.directionalLightCameraHelper = false;
    this.directionalLight = new DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(-15, 35, 40);
    this.directionalLight.castShadow = true;
    // directionalLight.shadow.camera.near = 1;
    // directionalLight.shadow.camera.far = 20;
    // directionalLight.shadow.bias = 0.01;
    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;
    this.directionalLight.shadow.camera.scale.x = 6;
    this.directionalLight.shadow.camera.scale.y = 6;
    engine.webgl.scene.add(this.directionalLight);
  }

  toogleHelper(enabled) {
    if (enabled) {
      // Create a helper for the shadow camera (optional)
      if (!this.directionalLightHelper) {
        this.directionalLightHelper = new DirectionalLightHelper(this.directionalLight, 10);
        this.directionalLightCameraHelper = new CameraHelper(this.directionalLight.shadow.camera);
        gui.addLight(this.directionalLight);
      }
      engine.webgl.scene.add(this.directionalLightCameraHelper);
      engine.webgl.scene.add(this.directionalLightHelper);
    } else {
      engine.webgl.scene.remove(this.directionalLightCameraHelper);
      engine.webgl.scene.remove(this.directionalLightHelper);
    }
  }
}

const lights = new Lights();
export default lights;
