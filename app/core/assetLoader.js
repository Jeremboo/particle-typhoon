
import { applyImageToCanvas } from 'core/utils';

import baseColor from 'assets/imgs/baseColor.png';


export const assets = {};

// loadAssets()
export default new Promise((resolve, reject) => applyImageToCanvas(baseColor)
.then((canvas) => {
  assets.canvasBaseColor = canvas;
}));
