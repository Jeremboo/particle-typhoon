/**
*
* app/core/utils.js
* Util generic functions.
*
**/

/*******
* MATH
*******/
// http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
export const getRandomInt = (min, max) => Math.floor((Math.random() * ((max - min) + 1))) + min;
export const getRandomFloat = (min, max) => ((Math.random() * (max - min)) + min);
export const getXBetweenTwoNumbers = (min, max, x) => 1 - ((max - x) / (max - min));
export const sqr = a => a * a;
// http://cwestblog.com/2012/11/12/javascript-degree-and-radian-conversion/
export const radians = deg => (deg * Math.PI) / 180;
export const degrees = rad => (rad * 180) / Math.PI;

/*******
* GEOMETRY 2D
*******/
export const getDistBetweenTwoVec2 = (x1, y1, x2, y2) => Math.sqrt(Math.sqr(y2 - y1) + Math.sqr(x2 - x1));


/*******
* GEOMETRY 3D / THREE.JS
*******/
import { Matrix4, Euler, Vector3 } from 'three';
export const getRotationMatrix = vectRotation => {
  const m = new Matrix4();
  const m1 = new Matrix4();
  const m2 = new Matrix4();
  const m3 = new Matrix4();

  m1.makeRotationX(-vectRotation.x);
  m2.makeRotationY(-vectRotation.y);
  m3.makeRotationY(-vectRotation.z);

  m.multiplyMatrices(m1, m2);
  m.multiply(m3);

  return m;
};

export const getRandomEuler = () => new Euler(
  getRandomFloat(0, 6.2831),
  getRandomFloat(0, 6.2831),
  getRandomFloat(0, 6.2831),
);

export const getRandomNormalizedVector3 = () => new Vector3(
  getRandomFloat(-1, 1),
  getRandomFloat(-1, 1),
  getRandomFloat(-1, 1),
);

export const getNormalizedPosFromScreen = (x, y) => new Vector3(
  ((x / window.innerWidth) * 2) - 1,
  -((y / window.innerHeight) * 2) + 1,
  0,
);

export const worldToLocalDirection = (object, worldDirectionVector, localDirectionVector) => {
  object.updateMatrixWorld();
  localDirectionVector.copy(worldDirectionVector).applyQuaternion(object.getWorldQuaternion().inverse());
  return localDirectionVector;
};



// CANVAS
export const canvasBuilder = (width = window.innerWidth, height = window.innerHeight) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  return {
    canvas,
    context,
    getImageData: () => context.getImageData(0, 0, width, height).data,
  };
};
export const applyImageToCanvas = (url, w, h) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = (e) => {
    if (e.target.status === 200) {
      const blob = e.target.response;
      const image = new Image();
      image.crossOrigin = 'Anonymous';
      image.onload = () => {
        const width = w || image.width;
        const height = h || image.height;
        const canvasB = canvasBuilder(width, height);
        canvasB.context.drawImage(image, 0, 0, width, height);
        window.URL.revokeObjectURL(blob);
        resolve(canvasB);
      };
      image.onerror = () => {
        reject('Err : Canvas cannot be loaded');
      };
      image.src = window.URL.createObjectURL(blob);
    }
  };
  xhr.send();
});
