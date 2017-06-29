
import { applyImageToCanvas } from 'core/utils';

import baseColor from 'assets/imgs/baseColor.png';

const assets = {
  baseColorImageData: [],
};

export default assets;

// loadAssets()
export const loadAssets = new Promise((resolve, reject) => {
  applyImageToCanvas(baseColor).then((canvas) => {
    assets.baseColorImageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    resolve();
  });
});
