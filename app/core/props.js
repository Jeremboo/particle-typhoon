

// CONST
export const CIRCLE = 'circle';
export const TWO_SOURCES = '2 sources';

// SIZES
export const TEXTURE_SIZE = 256; // 512;
export const TEXTURE_HEIGHT = TEXTURE_SIZE;
export const TEXTURE_WIDTH = TEXTURE_SIZE;

// PROPS
const props = {

  // TYPHOON
  POINT_SIZE: 1,
  INITIAL_POS: CIRCLE,

  DEMISE_DISTANCE: 0.5,
  MAX_DISTANCE: 10,

  VEL_MIN: 1, // 0.1,
  VEL_MAX: 2, // 0.1,
  VEL_BRAKE_MIN: 0.8, // 0.9,
  VEL_BRAKE: 0.9, // 0.9,

  ROT_CURVE: 1, // force of rotation at the center
  ROT_DIST: 0.18, // distance of force at the center
  ROT_FORCE: 0.08, // global rotation force

  ATT_CURVE: 0.4, // To reduce the exponential force
  ATT_DIST: 1.2,
  ATT_FORCE: 0.6,

  // SCENE
  FOG_NEAR: 0.15,
  FOG_FAR: 50,

  // PLANE
  CURVE_AMPL: 0.07,
  TURBULENCE_AMPL: 0.25,

  debug: {
    postProcess: {
      enabled: false,
    },
    webglHelper: true,
    disableWebgl: false,
    orbitControlsMainCamera: true,
  },
};

export default props;
