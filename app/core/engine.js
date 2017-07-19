import {
  AxisHelper, GridHelper,
  PerspectiveCamera, CameraHelper,
  Vector3,
} from 'three';

import OrbitControls from 'vendors/OrbitControls';

import Webgl from 'core/Webgl';
import GPUSimulation from 'core/GPUSimulation';
import gui from 'core/gui';
import loop from 'core/loop';
import { ease, getNormalizedPosFromScreen } from 'core/utils';
import props, { TEXTURE_WIDTH, TEXTURE_HEIGHT } from 'core/props';

class Engine {
  constructor() {
    this.webgl = false;
    this.gpuSim = false;
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
          // this.webgl.dom.style.zIndex = -1;
          document.body.appendChild(this.webgl.dom);

          // GPU Simulation
          this.gpuSim = new GPUSimulation(TEXTURE_WIDTH, TEXTURE_HEIGHT, this.webgl._renderer);
          if (process.env.NODE_ENV === 'development') {
            this.gpuSim.initHelper();
          }
          loop.add('gpuSim', this.gpuSim.update);

          // Add on resize for webgl
          window.addEventListener('resize', this._resize);
          window.addEventListener('orientationchange', this._resize);

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
    if (this.helperEnabled) {
      // TODO helper into an other file
      if (!this.gridHelper) this.gridHelper = new GridHelper(200, 200);
      if (!this.axisHelper) this.axisHelper = new AxisHelper(300);
      if (!this.debugCamera) {
        this.debugCamera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
        this.debugCamera.position.set(-17, 3, -3);
        this.controls = new OrbitControls(this.debugCamera, this.webgl.dom);
      }

      if (!this.cameraHelper) this.camerahelper = new CameraHelper(this.webgl.camera);

      document.querySelector('.dg.ac').style.zIndex = 10;
      this.webgl._renderer.setClearColor(0xaaaaaa, 1);

      this.webgl.add(this.gridHelper);
      this.webgl.add(this.axisHelper);
      this.webgl.add(this.debugCamera);
      this.webgl.add(this.camerahelper);

      this.webgl.currentCamera = this.debugCamera;
    } else {

      this.webgl._renderer.setClearColor(0xfefefe, 1);

      this.webgl.remove(this.gridHelper);
      this.webgl.remove(this.axisHelper);
      this.webgl.remove(this.debugCamera);
      this.webgl.remove(this.camerahelper);

      this.webgl.currentCamera = this.webgl.camera;
    }

    this.onToggleHelper(this.helperEnabled);
    gui.toggleHide();
  }

  start() {
    if (!props.debug.disableWebgl && props.debug.webglHelper && process.env.NODE_ENV !== 'production') {
      this.toggleHelper();
    }

    this.startCameraMotion();

    loop.start();
  }

  /**
   * Animates the camera at the beginning
   * Rotates the camera around the Y axis
   * Moves the camera depending of the mouse movement
   */
  startCameraMotion() {
    const cameraCoord = document.getElementById('camera-coord');

    let t = 6;
    let dist = props.BASE_DIST;
    let cameraLookAtY = props.LOOK_AT;
    let currentCameraLookAtY = props.LOOK_AT;

    // begining animation
    ease(props.EASE_DURATION, (easing) => {
      dist -= (dist - props.TARGETED_POSITION.dist) * easing;
      this.webgl.camera.position.y -= (this.webgl.camera.position.y - props.TARGETED_POSITION.y) * easing;
      this.webgl.scene.fog.far -= (this.webgl.scene.fog.far - props.FOG_FAR) * easing;
    });

    // add mouse move control
    document.addEventListener('mousemove', (e) => {
      const normalizedVector = getNormalizedPosFromScreen(e.x, e.y);
      cameraLookAtY = Math.max(props.LOOK_AT_MIN, props.LOOK_AT + (normalizedVector.y * 2));
    });

    // camera rotation auto
    loop.add('camera', () => {
      t += props.ROTATION_SPEED;
      // Position
      this.webgl.camera.position.x = Math.cos(t) * dist;
      this.webgl.camera.position.z = Math.sin(t) * dist;

      // Rotation
      currentCameraLookAtY -= (currentCameraLookAtY - cameraLookAtY) * 0.1;
      this.webgl.camera.lookAt(new Vector3(0, currentCameraLookAtY, 0));

      // HELPER camera position
      if (this.debugCamera) {
        const { x, y, z } = this.debugCamera.position;
        cameraCoord.innerHTML = `{ x: ${x}, y: ${y}, z: ${z} }`;
      }
    });
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
