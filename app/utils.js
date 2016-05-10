import {
  GRID_SIZE,
  CLICK_LENGTH_MS,
} from './constants.js';

export function snap(num) {
  return Math.round(num / GRID_SIZE) * GRID_SIZE;
}

export const isClient = typeof window !== 'undefined';

export function getDeltaXY(drag) {
  return {
    x: snap(drag.lastX - drag.startX),
    y: snap(drag.lastY - drag.startY),
  };
}

export function getEventDims(e) {
  const dims = e.touches ? e.touches[0] : e;

  return {
    x: dims.pageX,
    y: dims.pageY,
  };
}

export function eventWasAClick(dragInfo) {
  const shorterThanClickLength = performance.now() - dragInfo.dragStartTime < CLICK_LENGTH_MS;
  const narrowerThanGrid = Math.abs(dragInfo.startX - dragInfo.lastX) < GRID_SIZE;
  const shorterThanGrid = Math.abs(dragInfo.startY - dragInfo.lastY) < GRID_SIZE;

  return shorterThanClickLength && narrowerThanGrid && shorterThanGrid;
}

export const css = {
  hover: (styles) => {
    return {':hover': styles};
  },

  pos: (top, right, bottom, left) => {
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
  },

  padding: (top, right, bottom, left) => {
    return {
      paddingTop: top,
      paddingRight: right,
      paddingLeft: left,
      paddingBottom: bottom,
    };
  },

  margin: (top, right, bottom, left) => {
    return {
      marginTop: top,
      marginRight: right,
      marginLeft: left || right,
      marginBottom: bottom || top,
    };
  },

  background: (rules) => {
    const result = {};

    if (rules.image) result.backgroundImage = rules.image;
    if (rules.positionX) result.backgroundPositionX = rules.positionX;
    if (rules.positionY) result.backgroundPositionY = rules.positionY;
    if (rules.repeat) result.backgroundRepeat = rules.repeat;
    if (rules.size) result.backgroundSize = rules.size;

    return result;
  },

  forSize: (query, rules) => {
    return {
      [query]: rules,
    };
  },

  shadow: (style = 'large') => {
    const px = style === 'large' ? '10px' : '5px';

    switch (style) {
      case 'light' :
        return {boxShadow: `0 0 10px rgba(0, 0, 0, .2)`};
      case 'large' :
        return {boxShadow: `2px 2px 20px rgba(0, 0, 0, .2)`};
      default :
        return {boxShadow: `0 0 5px rgba(51, 51, 51, .2)`};
    }
  },

  border: (...args) => {
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
  },
};
