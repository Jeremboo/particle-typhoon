import {
  Object3D, ShaderMaterial,
  UniformsUtils, UniformsLib, FlatShading, DoubleSide,
  Vector3,
} from 'three';

import props, { TEXTURE_WIDTH, TEXTURE_HEIGHT, TWO_SOURCES, CIRCLE } from 'core/props';
import { getRandomFloat, getXBetweenTwoNumbers, radians } from 'core/utils';
import engine from 'core/engine';
import assets from 'core/assetLoader';
import gui from 'core/gui';

import shaderSimulationPosition from 'shaders/simulationPosition.f.glsl';
import shaderSimulationVelocity from 'shaders/simulationVelocity.f.glsl';

import particleVert from 'shaders/particle.v.glsl';
import particleFrag from 'shaders/particle.f.glsl';

import vertDeth from 'shaders/depth.v.glsl';
import fragDeth from 'shaders/depth.f.glsl';

import lights from 'objects/Lights';
import Particles from 'objects/Particles';

export default class Typhoon extends Object3D {
  constructor() {
    super();

    // INIT DATA TEXTURES
    this.dt = {};
    this.initDataTextures();

    // INIT SIMULATIONS
    this.velocityFBO = engine.gpuSim.createSimulation(
      'textureVelocity', shaderSimulationVelocity, this.dt.velocity, {
        uniforms: {
          // positionfBO texture (should be updated)
          positionTexture: { type: 't', value: null },
          // gravity params
          attractionCurve: { type: 'f', value: props.ATT_CURVE },
          attractionDistance: { type: 'f', value: props.ATT_DIST },
          attractionForce: { type: 'f', value: props.ATT_FORCE },
          // velocity params: VEL_MAX, VEL_BRAKE
          propsTexture: { type: 'f', value: this.dt.props },
          // distance of demise and the external circle distance
          demiseDistance: { type: 'f', value: props.DEMISE_DISTANCE },
          maxDistance: { type: 'f', value: props.MAX_DISTANCE },
        },
      },
    );
    this.positionFBO = engine.gpuSim.createSimulation(
      'texturePosition', shaderSimulationPosition, this.dt.position, {
        uniforms: {
          // Fist position of each particle
          initialPositionTexture: { type: 't', value: this.dt.position },
          // velocityFBO texture (should be updated)
          velocityTexture: { type: 't', value: this.velocityFBO.output.texture },
          // Demise distance
          demiseDistance: { type: 'f', value: props.DEMISE_DISTANCE },
          // Global rotation force
          rotationCurve: { type: 'f', value: props.ROT_CURVE },
          rotationDistance: { type: 'f', value: props.ROT_DIST },
          rotationForce: { type: 'f', value: props.ROT_FORCE },
        },
      },
    );
    // Not need to update the materials on each loop. Just pass per reference
    this.velocityFBO.material.uniforms.positionTexture.value = this.positionFBO.output.texture;


    // CREATE PARTICLES
    const uniformsLib = UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.lights,
      UniformsLib.shadowmap,
      UniformsLib.fog,
    ]);

    const particleMaterial = new ShaderMaterial({
      uniforms: Object.assign({
        colors: { type: 't', value: this.dt.colors },
        positions: { type: 't', value: this.positionFBO.output.texture },
        pointSize: { type: 'f', value: props.POINT_SIZE },
        ligthIntensity: { type: 'v3', value: lights.ambiantLight.color.clone().multiplyScalar(lights.ambiantLight.intensity) },
        // lightPosition: { type: 'v3', value: lights.directionalLight.position },
        lightPosition: { type: 'v3', value: new Vector3(
          lights.directionalLight.position.x,
          -lights.directionalLight.position.y + 1,
          lights.directionalLight.position.z,
        ) },
      }, uniformsLib),
      vertexShader: particleVert,
      fragmentShader: particleFrag,
      transparent: true,
      lights: true,
      fog: true,
      shading: FlatShading,
      side: DoubleSide,
    });

    this.particles = new Particles(TEXTURE_WIDTH, TEXTURE_HEIGHT, particleMaterial);
    this.particles.castShadow = true;
    this.particles.receiveShadow = true;
    this.particles.rotation.x = radians(-90);
    // https://stackoverflow.com/questions/32855271/three-js-buffergeometry-disappears-after-moving-camera-to-close
    this.particles.frustumCulled = false;
    // Override the default DepthMaterial
    this.particles.customDepthMaterial = new ShaderMaterial({
      vertexShader: vertDeth,
      fragmentShader: fragDeth,
      uniforms: particleMaterial.uniforms,
      discard: true,
    });
    this.add(this.particles);

    this.initHelpers();


    // BINDING
    this.update = this.update.bind(this);
    this.initDataTextures = this.initDataTextures.bind(this);
    this.reload = this.reload.bind(this);
  }

  /**
   * ****************
   * DATA TEXTURES
   *****************
   **/

  /**
   * Init all data textures
   */
  initDataTextures() {
    this.dt = {
      position: engine.gpuSim.createDataTexture(),
      velocity: engine.gpuSim.createDataTexture(),
      props: engine.gpuSim.createDataTexture(),
      colors: engine.gpuSim.createDataTexture(),
    };

    const textureArraySize = TEXTURE_WIDTH * TEXTURE_HEIGHT * 4;

    // init velocity
    for (let i = 0; i < textureArraySize; i += 4) {
      this.setRGBAToDataTexture('velocity', i);

      this.setRGBAToDataTexture('props', i, {
        x: getRandomFloat(props.VEL_MIN, props.VEL_MAX),
        y: getRandomFloat(props.VEL_BRAKE_MIN, props.VEL_BRAKE),
      });
    }

    // init position
    switch (props.INITIAL_POS) {
      case TWO_SOURCES:
        const dist = props.DEMISE_DISTANCE * 2;
        const alfTextureArraySize = textureArraySize * 0.5;
        for (let i = 0; i < alfTextureArraySize; i += 4) {
          const radius = getRandomFloat(0, props.MAX_DISTANCE);
          const azimuth = Math.random() * Math.PI;
          const x = ((radius * Math.sin(azimuth) * Math.cos(azimuth)) * 0.1);
          const y = (((radius * Math.sin(azimuth) * Math.sin(azimuth)) - (radius * 0.5)) * 0.1);

          this.setRGBAToDataTexture('position', i, {
            x: x + dist,
            y: y + dist,
            z: getRandomFloat(0.1, 0.2),
          });
          this.updateDTColors(x + dist, y + dist, i);

          this.setRGBAToDataTexture('position', alfTextureArraySize + i, {
            x: x - dist,
            y: y - dist,
            z: getRandomFloat(0.1, 0.2),
          });
          this.updateDTColors(x - dist, y - dist, alfTextureArraySize + i);
        }
        break;
      case CIRCLE:
      default:
        for (let i = 0; i < textureArraySize; i += 4) {
          const radius = getRandomFloat(props.DEMISE_DISTANCE * 3, props.MAX_DISTANCE);
          const azimuth = Math.random() * Math.PI;
          const x = radius * Math.sin(azimuth) * Math.cos(azimuth);
          const y = (radius * Math.sin(azimuth) * Math.sin(azimuth)) - (radius * 0.5);
          const z = getRandomFloat(0.001, 0.2) * (props.MAX_DISTANCE - radius) * 0.4;
          this.setRGBAToDataTexture('position', i, { x, y, z });

          this.updateDTColors(x, y, i);
        }
    }
  }

  /**
   * Update the colors dataTexture in terms of position dataTexture
   */
  updateDTColors(xPos, yPos, i) {
    const maxPosition = props.MAX_DISTANCE * 0.5;

    const xPercent = getXBetweenTwoNumbers(-maxPosition, maxPosition, xPos);
    const yPercent = getXBetweenTwoNumbers(-maxPosition, maxPosition, yPos);

    const xPixelPos = Math.floor(xPercent * assets.baseColor.width);
    const yPixelPos = Math.floor(yPercent * assets.baseColor.height);

    const dataPos = (assets.baseColor.height * yPixelPos * 4) + (xPixelPos * 4);

    this.setRGBAToDataTexture('colors', i, {
      x: assets.baseColor.imageData[dataPos] / 255,
      y: assets.baseColor.imageData[dataPos + 1] / 255,
      z: assets.baseColor.imageData[dataPos + 2] / 255,
    });
  }

  /**
   * Update a RGBA pixel into a dataTexture position
   */
  setRGBAToDataTexture(dtName, i, { x = 0, y = 0, z = 0, a = 1 } = {}) {
    if (!this.dt[dtName]) {
      console.log(`ERROR: The data texture ${dtName} doesn't exist`);
      return;
    }

    this.dt[dtName].image.data[i] = x;
    this.dt[dtName].image.data[i + 1] = y;
    this.dt[dtName].image.data[i + 2] = z;
    this.dt[dtName].image.data[i + 3] = a;
  }

  /**
   * ****************
   * UPDATE
   *****************
   **/

  update() {}

  /**
   * ****************
   * HELPERS
   *****************
   **/

  reload() {
    this.initDataTextures();

    // Update posible new position
    this.positionFBO.initialDataTexture = this.dt.position;
    this.positionFBO.material.uniforms.initialPositionTexture.value = this.positionFBO.initialDataTexture;
    engine.gpuSim.updateSimulation(this.positionFBO, this.positionFBO.initialDataTexture);

    // Update colors
    this.particles.material.uniforms.colors.value = this.dt.colors;

    // Init velocity (always the same init)
    engine.gpuSim.updateSimulation(this.velocityFBO, this.velocityFBO.initialDataTexture);
  }

  initHelpers() {
    const typhoon = gui.addFolder('Typhoon');
    const global = typhoon.addFolder('Global');
    global.add(props, 'INITIAL_POS', [CIRCLE, TWO_SOURCES]).onChange(this.reload.bind(this));
    global.add(props, 'POINT_SIZE', 1, 100).onChange(() => {
      this.particles.material.uniforms.pointSize.value = props.POINT_SIZE;
    });
    global.add(props, 'DEMISE_DISTANCE', 0, 3).onChange(() => {
      this.positionFBO.material.uniforms.demiseDistance.value = props.DEMISE_DISTANCE;
      this.velocityFBO.material.uniforms.demiseDistance.value = props.DEMISE_DISTANCE;
    });

    // rotation
    const rotation = typhoon.addFolder('Rotation');
    rotation.add(props, 'ROT_CURVE', 0, 1).onChange(() => {
      this.positionFBO.material.uniforms.rotationCurve.value = props.ROT_CURVE;
    });
    rotation.add(props, 'ROT_DIST', 0, 1).onChange(() => {
      this.positionFBO.material.uniforms.rotationDistance.value = props.ROT_DIST;
    });
    rotation.add(props, 'ROT_FORCE', 0, 0.1).onChange(() => {
      this.positionFBO.material.uniforms.rotationForce.value = props.ROT_FORCE;
    });

    // attraction
    const attraction = typhoon.addFolder('Attraction');
    attraction.add(props, 'ATT_CURVE', 0, 1).onChange(() => {
      this.velocityFBO.material.uniforms.attractionCurve.value = props.ATT_CURVE;
    });
    attraction.add(props, 'ATT_DIST', 0, 2).onChange(() => {
      this.velocityFBO.material.uniforms.attractionDistance.value = props.ATT_DIST;
    });
    attraction.add(props, 'ATT_FORCE', 0, 2).onChange(() => {
      this.velocityFBO.material.uniforms.attractionForce.value = props.ATT_FORCE;
    });

    // Reset button
    props.reset = this.reload.bind(this);
    typhoon.add(props, 'reset');
  }
}
