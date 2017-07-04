
import { GUI } from 'dat-gui';

import props from 'core/props';

class Gui extends GUI {
  constructor() {
    super();
    this.enabled = false;
    this.folders = [];

    this.addMesh = this.addMesh.bind(this);
    this.initGui = this.initGui.bind(this);
    this.toggleHide = this.toggleHide.bind(this);
  }

  initGui() {
    this.toggleHide();
  }

  toggleHide() {
    this.enabled = !this.enabled;
    GUI.toggleHide();

    // fbo gui
    this.fboGui = document.getElementById('fboh-fbos-list');
    if (this.enabled) {
      this.fboGui.style.display = 'none';
    } else {
      this.fboGui.style.display = 'block';
    }
  }

  /**
   * *********
   * ADD
   * *********
   */

  // add light to move her
  addLight(light, name = `Light-${light.uuid}`, params) {
    props.rotation = props.rotation || false;
    const lightFolder = this._addObject3D(light, name, params);
    if (lightFolder && light.power) lightFolder.add(light, 'power', 0, 25.132741229);
  }

  // add mesh to move him
  addMesh(mesh, name = `Mesh-${mesh.uuid}`, params) {
    const meshFolder = this._addObject3D(mesh, name, params);
  }

  /**
   * *********
   * PRIVATE
   * *********
   */
  _addObject3D(object, name = `Object3D-${object.uuid}`, { position = true, rotation = true } = props) {
    if (!this) {
      console.log('ERROR: the gui is not initialised');
      return false;
    }

    const objectFolder = this.addFolder(name);

    if (position) {
      const posFolder = objectFolder.addFolder('Position');
      posFolder.add(object.position, 'x', -50, 50);
      posFolder.add(object.position, 'y', -50, 50);
      posFolder.add(object.position, 'z', -50, 50);
    }

    if (rotation) {
      const rotFolder = objectFolder.addFolder('Rotation');
      rotFolder.add(object.rotation, 'x', -Math.PI, Math.PI);
      rotFolder.add(object.rotation, 'y', -Math.PI, Math.PI);
      rotFolder.add(object.rotation, 'z', -Math.PI, Math.PI);
    }

    // TODO scale folder

    return objectFolder;
  }
}
const gui = new Gui();
export default gui;
