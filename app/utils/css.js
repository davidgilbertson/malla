import {
  BREAKPOINTS,
} from '../constants.js';

export function hover(styles) {
  return {':hover': styles};
}

export function pos(top, right, bottom, left) {
  const result = {};

  if (typeof left === 'undefined') {
    console.warn('The pos  needs four positions');
    return result;
  }

  if (top !== null) result.top = top;
  if (right !== null) result.right = right;
  if (bottom !== null) result.bottom = bottom;
  if (left !== null) result.left = left;

  return result;
}

export function padding(top, right, bottom, left) {
  return {
    paddingTop: top,
    paddingRight: right,
    paddingLeft: left,
    paddingBottom: bottom,
  };
}

export function margin(top, right, bottom, left) {
  return {
    marginTop: top,
    marginRight: right,
    marginLeft: left || right,
    marginBottom: bottom || top,
  };
}

export function background(rules) {
  const result = {};

  if (rules.image) result.backgroundImage = rules.image;
  if (rules.positionX) result.backgroundPositionX = rules.positionX;
  if (rules.positionY) result.backgroundPositionY = rules.positionY;
  if (rules.repeat) result.backgroundRepeat = rules.repeat;
  if (rules.size) result.backgroundSize = rules.size;

  return result;
}

export function shadow(style = 'medium') {
  switch (style) {
    case 'small' :
      return {boxShadow: `0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.2),0 1px 5px 0 rgba(0,0,0,0.12)`};
    case 'medium' :
      return {boxShadow: `0 2px 15px rgba(0,0,0,0.30)`};
    case 'large' :
      return {boxShadow: `0 27px 55px 0 rgba(0, 0, 0, 0.3), 0 17px 17px 0 rgba(0, 0, 0, 0.15)`};
    default :
      return {};
  }
}

export function border(...args) {
  let components;

  if (args.length === 3) {
    components = args;
  } else {
    components = args[0].split(' '); // assume a string is passed in
  }

  if (components.length !== 3) return {};

  return {
    borderWidth: components[0],
    borderStyle: components[1],
    borderColor: components[2],
  };
}

export function showForPhoneOnly() {
  return {
    [BREAKPOINTS.TABLET_PORTRAIT]: {
      display: 'none',
    },
  }
}

export function showForTabletPortraitUp() {
  return {
    display: 'none',
      [BREAKPOINTS.TABLET_PORTRAIT]: {
      display: 'initial',
    }
  }
}
