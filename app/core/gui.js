
import dat from 'dat-gui';

import props from 'core/props';

class Gui {
  constructor() {
    this.enabled = false;
    this.gui = false;

    this.addMesh = this.addMesh.bind(this);
    this.initGui = this.initGui.bind(this);
    this.toggleHide = this.toggleHide.bind(this);
  }

  initGui() {
    this.enabled = true;
    this.gui = new dat.GUI();
    this.gui.close();
    this.toggleHide();

    this.rotationSpeed = this.gui.add(props, 'rotationSpeed', 0, 1);

    // PostProcess
    // this.postProcessFolder = this.gui.addFolder('PostProcess');
    // this.postProcessFolder.add(props.postProcess, 'enabled');

  }

  toggleHide() {
    dat.GUI.toggleHide();
  }

  addObject3D(object, name = `Object3D-${object.uuid}`, { position = true, rotation = true } = props) {
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

  addLight(light, name = `Light-${light.uuid}`, params) {
    props.rotation = props.rotation || false;
    const lightFolder = this.addObject3D(light, name, params);
    if (lightFolder) lightFolder.add(light, 'power', 0, 25.132741229);
  }

  addMesh(mesh, name = `Mesh-${mesh.uuid}`, params) {
    const meshFolder = this.addObject3D(mesh, name, params);
  }
}
const gui = new Gui();
export default gui;
