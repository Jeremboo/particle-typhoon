import { Scene, PerspectiveCamera, WebGLRenderer, PCFSoftShadowMap } from 'three';

// import OrbitControls from 'vendors/OrbitControls';

// import { Composer } from '@superguigui/wagner';
// import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass';
// import VignettePass from '@superguigui/wagner/src/passes/vignette/VignettePass';

import props from 'core/props';
import loop from 'core/loop';

export default class Webgl {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.scene = new Scene();

    this.camera = new PerspectiveCamera(50, w / h, 1, 1000);
    this.camera.position.z = 100;
    this.currentCamera = this.camera;

    this._renderer = new WebGLRenderer({
      antialias: true,
    });
    this._renderer.setPixelRatio(window.devicePixelRatio || 1);
    this._renderer.setClearColor(0xFEFEFE, 1);
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = PCFSoftShadowMap;

    this.dom = this._renderer.domElement;

    // this.controls = new OrbitControls(this.camera, this.dom);
    // this.controls.enabled = false;

    this._composer = false;
    this._passes = [];
    this.initPostprocessing();

    this.initPostprocessing = this.initPostprocessing.bind(this);
    this.update = this.update.bind(this);
    this.resize = this.resize.bind(this);

    loop.add('0000', this.update);
    this.resize(w, h);
  }

  initPostprocessing() {
    // TODO add postprocess.js add() / remove()
    // this._composer = new Composer(this._renderer);

    // if (!props.postProcess.enabled) return;
    // this._passes.push(new VignettePass({ reduction: 0.5 }));
    // this._passes.push(new FXAAPass({}));
  }

  add(mesh, _id) {
    const id = _id || mesh.uuid;
    if (!id) {
      console.log('ERROR: Webgl.add(): need an id');
      return;
    }
    this.scene.add(mesh);
    if (!mesh.update) return;
    loop.add(id, () => { mesh.update(); });
  }

  remove(mesh, id) {
    this.scene.remove(mesh);
    if (!mesh.update) return;
    loop.remove(id || mesh.uuid, () => { mesh.update(); });
  }

  update() {
    if (props.postProcess.enabled) {
      this._composer.reset();
      this._composer.renderer.clear();
      this._composer.render(this.scene, this.camera);
      let i;
      for (i = this._passes.length - 1; i >= 0; i--) {
        this._composer.pass(this._passes[i]);
      }
      this._composer.toScreen();
    }

    this._renderer.render(this.scene, this.currentCamera);
  }

  resize(w, h) {
    this.width = w;
    this.height = h;

    this.currentCamera.aspect = w / h;
    this.currentCamera.updateProjectionMatrix();

    this._renderer.setSize(w, h);

    if (props.postProcess.enabled) {
     this._composer.setSize(w, h);
    }
  }
}
