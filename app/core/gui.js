
import dat from 'dat-gui';

import props from 'core/props';

class Gui {
  constructor() {
    this.enabled = false;
    this.gui = false;
    this.folders = [];

    this.addMesh = this.addMesh.bind(this);
    this.initGui = this.initGui.bind(this);
    this.toggleHide = this.toggleHide.bind(this);
  }

  initGui() {
    this.enabled = true;
    this.gui = new dat.GUI();
    this.gui.close();
    this.toggleHide();
  }

  toggleHide() {
    dat.GUI.toggleHide();
  }

  /**
   * *********
   * ADD
   * *********
   */

  // add global prop
  add(name, { min = 0, max = 9999, onChange = f => f, folderName = false } = {}) {
    const folder = (folderName && (this.folders[folderName] || this.gui.addFolder(folderName))) || this.gui;
    folder.add(props, name, min, max).onChange(onChange);
  }

  // add light to move her
  addLight(light, name = `Light-${light.uuid}`, params) {
    props.rotation = props.rotation || false;
    const lightFolder = this._addObject3D(light, name, params);
    if (lightFolder) lightFolder.add(light, 'power', 0, 25.132741229);
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
    if (!this.gui) {
      console.log('ERROR: the gui is not initialised');
      return false;
    }

    const objectFolder = this.gui.addFolder(name);

    if (position) {
      const posFolder = objectFolder.addFolder('Position');
      posFolder.add(object.position, 'x', -1000, 1000);
      posFolder.add(object.position, 'y', -1000, 1000);
      posFolder.add(object.position, 'z', -1000, 1000);
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
