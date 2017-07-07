import {
  PlaneGeometry, MeshPhongMaterial, Mesh, Object3D,
} from 'three';

import props from 'core/props';
import { radians, getRandomFloat, sqr } from 'core/utils';

// const SIZE = props.FOG_FAR * 2;
const SIZE = props.FOG_FAR * 0.5;
const VERTICES_PER_LINE = 32;

export default class Plane extends Object3D {
  constructor() {
    super();

    // TODO use an height map !

    // Global geometry
    const planeGeometry = new PlaneGeometry(SIZE, SIZE, VERTICES_PER_LINE, VERTICES_PER_LINE);

    // White plane
    const planeMaterial = new MeshPhongMaterial();
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // GridPlane
    const planeMaterial2 = new MeshPhongMaterial({ color: 0x000000, wireframe: true });
    const plane2 = new Mesh(planeGeometry, planeMaterial2);

    this.add(plane);
    this.add(plane2);
    this.rotation.x = radians(-90);
  }
}
