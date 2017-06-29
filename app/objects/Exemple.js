import {
  Object3D, Vector4, TetrahedronGeometry, MeshBasicMaterial,
  ShaderMaterial, Mesh
} from 'three';

import props from 'core/props';

import vertexShader from 'shaders/example.v.glsl';
import fragmentShader from 'shaders/example.f.glsl';


export default class Exemple extends Object3D {
  constructor() {
    super();

    const geometry = new TetrahedronGeometry(10, 0);
    // const material = new MeshBasicMaterial({ color: 0xffffff });
    const material = new ShaderMaterial({
      uniforms: {
        color: {
          type: 'v4',
          value: new Vector4(0.9, 0.715, 0.072, 1) },
      },
      vertexShader,
      fragmentShader,
      wireframe: true,
    });

    this.mesh = new Mesh(geometry, material);

    this.add(this.mesh);

    this.update = this.update.bind(this);
  }

  update() {
    this.rotation.x += props.rotationSpeed;
    this.rotation.y += props.rotationSpeed;
  }
}
