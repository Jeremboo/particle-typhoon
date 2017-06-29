import {
  Object3D, WebGLRenderer, Color,
  ShaderMaterial,
} from 'three';

import props from 'core/props';
import engine from 'core/engine';

import shaderSimulationPosition from 'shaders/simulationPosition.f.glsl';
import shaderSimulationVelocity from 'shaders/simulationVelocity.f.glsl';

import particleVert from 'shaders/particle.v.glsl';
import particleFrag from 'shaders/particle.f.glsl';


export default class Typhoon extends Object3D {
  constructor() {
    super();


    this.update = this.update.bind(this);
  }

  update() {

  }
}
