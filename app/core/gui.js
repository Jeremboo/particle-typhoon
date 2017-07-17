
import { GUI } from 'dat-gui';

import props from 'core/props';

class Gui extends GUI {
  constructor() {
    super();
    this.enabled = false;
    this.folders = [];

    GUI.toggleHide();

    this.addMesh = this.addMesh.bind(this);
    this.toggleHide = this.toggleHide.bind(this);
  }

  toggleHide() {
    this.enabled = !this.enabled;
    GUI.toggleHide();

    const fboGui = document.getElementById('fboh-fbos-list');
    const debugCameraCoord = document.getElementById('camera-coord');
    // const gui = document.querySelector('.dg.ac');

    // fbo gui
    if (this.enabled) {
      fboGui.style.display = 'block';
      debugCameraCoord.style.display = 'block';
      // gui.style.display = 'block';
    } else {
      fboGui.style.display = 'none';
      debugCameraCoord.style.display = 'none';
      // gui.style.display = 'none';
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
