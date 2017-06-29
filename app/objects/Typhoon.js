import {
  Object3D, ShaderMaterial,
} from 'three';

import props, { TEXTURE_WIDTH, TEXTURE_HEIGHT, TWO_SOURCES, CIRCLE } from 'core/props';
import { getRandomFloat, getXBetweenTwoNumbers } from 'core/utils';
import engine from 'core/engine';
import assets from 'core/assetLoader';

import shaderSimulationPosition from 'shaders/simulationPosition.f.glsl';
import shaderSimulationVelocity from 'shaders/simulationVelocity.f.glsl';

import particleVert from 'shaders/particle.v.glsl';
import particleFrag from 'shaders/particle.f.glsl';

import Particles from 'objects/Particles';

export default class Typhoon extends Object3D {
  constructor() {
    super();

    // INIT DATA TEXTURES
    this.dt = {};
    this.initDataTexture();

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
    const particleMaterial = new ShaderMaterial({
      uniforms: {
        colors: { type: 't', value: this.dt.colors },
        positions: { type: 't', value: this.positionFBO.output.texture },
        pointSize: { type: 'f', value: props.POINT_SIZE },
      },
      vertexShader: particleVert,
      fragmentShader: particleFrag,
      transparent: true,
    });

    this.particles = new Particles(TEXTURE_WIDTH, TEXTURE_HEIGHT, particleMaterial);
    this.add(this.particles);


    // BINDING
    this.update = this.update.bind(this);
    this.initDataTexture = this.initDataTexture.bind(this);
  }

  /**
   * ****************
   * DATA TEXTURES
   *****************
   **/

  /**
   * Init all data textures
   */
  initDataTexture() {
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
    console.log(this.dt);
  }

  /**
   * Update the colors dataTexture in terms of position dataTexture
   */
  updateDTColors(xPos, yPos, i) {
    const maxPosition = props.MAX_DISTANCE * 0.5;
    const xPercent = getXBetweenTwoNumbers(-maxPosition, maxPosition, xPos);
    const yPercent = getXBetweenTwoNumbers(-maxPosition, maxPosition, yPos);

    const xPosition = Math.floor(xPercent * TEXTURE_WIDTH) * 4;
    const yPosition = Math.floor(yPercent * TEXTURE_HEIGHT) * 4;

    const position = (TEXTURE_HEIGHT * yPosition) + xPosition;

    this.setRGBAToDataTexture('colors', i, {
      x: assets.baseColorImageData[position] / 255,
      y: assets.baseColorImageData[position + 1] / 255,
      z: assets.baseColorImageData[position + 2] / 255,
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

  update() {

  }
}
