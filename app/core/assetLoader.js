
import { applyImageToCanvas } from 'core/utils';

import baseColor from 'assets/imgs/baseColor.png';

const assets = {
  baseColorImageData: [],
};

export default assets;

// loadAssets()
export const loadAssets = new Promise((resolve, reject) => {
  applyImageToCanvas(baseColor).then((canvasBuilder) => {
    assets.baseColor = {
      imageData: canvasBuilder.getImageData(),
      width: canvasBuilder.canvas.width,
      height: canvasBuilder.canvas.height,
    };
    resolve();
  });
});
