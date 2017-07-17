
import { easing } from 'core/utils';

import './style.styl';

class Loader {
  constructor() {
    this.elm = document.getElementById('loader');
  }

  show() {
    this.elm.style.opacity = 1;
  }

  hide() {
    // this.elm.style.opacity = 0;
    this.elm.style.zIndex = -1;
  }
}

const loader = new Loader();
export default loader;
