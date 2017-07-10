import {
  PlaneGeometry, MeshPhongMaterial, Mesh, Object3D,
} from 'three';
import { Noise } from 'noisejs';

import props from 'core/props';
import gui from 'core/gui';
import { radians, sqr } from 'core/utils';

const SIZE = 125;
const VERTICES_PER_LINE = 32;

export default class Plane extends Object3D {
  constructor() {
    super();

    // Global geometry
    this.planeGeometry = new PlaneGeometry(SIZE, SIZE, VERTICES_PER_LINE, VERTICES_PER_LINE);
    this.generateHeight();

    // White plane
    const planeMaterial = new MeshPhongMaterial();
    const plane = new Mesh(this.planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // GridPlane
    const planeMaterial2 = new MeshPhongMaterial({ color: 0x000000, wireframe: true });
    const plane2 = new Mesh(this.planeGeometry, planeMaterial2);
    plane2.position.z += 0.05;

    this.add(plane);
    this.add(plane2);
    this.rotation.x = radians(-90);

    this.generateHeight = this.generateHeight.bind(this);

    // HELPER
    const planeDir = gui.addFolder('Plane');
    planeDir.add(props, 'CURVE_AMPL', 0, 1).onChange(() => {
      this.generateHeight();
    });
    planeDir.add(props, 'TURBULENCE_AMPL', 0, 1).onChange(() => {
      this.generateHeight();
    });
  }

  generateHeight() {
    let i, j;
    const noise = new Noise(0.5);
    const verticesPerLine = VERTICES_PER_LINE + 1;
    for (i = 0; i < verticesPerLine; i++) {
      for (j = 0; j < verticesPerLine; j++) {
        const x = i * verticesPerLine;
        const y = j;
        const ampl = ((sqr(j - (VERTICES_PER_LINE * 0.5))) + (sqr(i - (VERTICES_PER_LINE * 0.5))));
        this.planeGeometry.vertices[x + y].z = (ampl * props.CURVE_AMPL) + (noise.simplex2(x / 100, y) * ampl * props.TURBULENCE_AMPL);
      }
    }
    this.planeGeometry.verticesNeedUpdate = true;
  }
}
