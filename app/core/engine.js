import {
  AxisHelper, GridHelper,
  PerspectiveCamera, CameraHelper,
} from 'three';

import OrbitControls from 'vendors/OrbitControls';

import Webgl from 'core/Webgl';
import gui from 'core/gui';
import loop from 'core/loop';
import props from 'core/props';

class Engine {
  constructor() {
    this.webgl = false;
    this.helperEnabled = false;
    this.onResize = false; // Callback of onResize listener

    this.init = this.init.bind(this);
    this._resize = this._resize.bind(this);

    this.onToggleHelper = f => f;
    this.toggleHelper = this.toggleHelper.bind(this);

    // TOGGLE HELPER
    // TODO make code combinaison
    if (process.env.NODE_ENV === 'development') {
      document.addEventListener('keydown', (e) => {
        if (e.keyCode === 192) {
          this.toggleHelper();
        }
      });
    }
  }

  /**
   ****************
   * INIT
   ****************
   */
  init() {
    return new Promise((resolve, reject) => {
      if (!props.debug.disableWebgl || process.env.NODE_ENV === 'production') {
        try {
          // Start webgl
          this.webgl = new Webgl(window.innerWidth, window.innerHeight);
          this.webgl.dom.style.position = 'fixed';
          this.webgl.dom.style.top = 0;
          this.webgl.dom.style.left = 0;
          this.webgl.dom.style.zIndex = -1;
          document.body.appendChild(this.webgl.dom);

          loop.start();

          // Add on resize for webgl
          window.addEventListener('resize', this._resize);
          window.addEventListener('orientationchange', this._resize);

          if (!props.debug.disableWebgl && props.debug.webglHelper && process.env.NODE_ENV !== 'production') {
            this.toggleHelper();
          }

          resolve();
        } catch (e) { reject(e); }
      }
    });
  }

  /**
   ****************
   * HELPER
   ****************
   */
  toggleHelper() {
    this.helperEnabled = !this.helperEnabled;
    this.onToggleHelper(this.helperEnabled);
    if (this.helperEnabled) {
      // TODO helper into an other file
      if (!gui.enabled) gui.initGui();
      if (!this.gridHelper) this.gridHelper = new GridHelper(200, 200);
      if (!this.axisHelper) this.axisHelper = new AxisHelper(300);
      if (!this.debugCamera) {
        this.debugCamera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
        this.debugCamera.position.z = 150;
        this.controls = new OrbitControls(this.debugCamera, this.webgl.dom);
      }

      if (!this.cameraHelper) this.camerahelper = new CameraHelper(this.webgl.camera);

      gui.toggleHide();

      document.querySelector('.dg.ac').style.zIndex = 10;
      this.webgl._renderer.setClearColor(0xaaaaaa, 1);

      this.webgl.add(this.gridHelper);
      this.webgl.add(this.axisHelper);
      this.webgl.add(this.debugCamera);
      this.webgl.add(this.camerahelper);

      this.webgl.currentCamera = this.debugCamera;
    } else {
      gui.toggleHide();

      this.webgl._renderer.setClearColor(0xfefefe, 1);

      this.webgl.remove(this.gridHelper);
      this.webgl.remove(this.axisHelper);
      this.webgl.remove(this.debugCamera);
      this.webgl.remove(this.camerahelper);

      this.webgl.currentCamera = this.webgl.camera;
    }
  }

  /**
   ****************
   * LISTENERS
   ****************
   */
  _resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (typeof (this.onResize) === 'function') this.onResize(w, h);
    this.webgl.resize(w, h);

    props.isMobile = window.innerWidth < 600;
  }
}

export default new Engine();
