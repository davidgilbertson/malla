const BREAKPOINT_SIZES = {
  SMALL_MED: 480,
  MED_LARGE: 880,
  LARGE_JUMBO: 1120,
};

const BREAKPOINTS = {
  SMALL_ONLY: `@media (max-width: ${BREAKPOINT_SIZES.SMALL_MED}px)`,
  MEDIUM_UP: `@media (min-width: ${BREAKPOINT_SIZES.SMALL_MED}px)`,
  LARGE_UP: `@media (min-width: ${BREAKPOINT_SIZES.MED_LARGE}px)`,
  JUMBO_UP: `@media (min-width: ${BREAKPOINT_SIZES.LARGE_JUMBO}px)`,
};

const DIMENSIONS = {
  LAYOUT: {
    HEADER_HEIGHT: 60,
    TOOLBAR_WIDTH: 120,
  },
  TEXT: {
    HEADING_1: 40,
    HEADING_2: 30,
    HEADING_3: 20, // TODO: no idea, just messing around
  },
};

// palette generated by: http://www.materialpalette.com/blue/deep-orange
const COLORS = {
  // BLACK: '#000000',
  // PRIMARY: RAW_COLORS.INDIGO_500,
  // SECONDARY: RAW_COLORS.PINK_500,
  // SECONDARY_50: '#E8EAF6',
  // GRAY_800: '#424242',
  // GRAY_900: '#212121',

  PRIMARY_DARK: '#1976D2', // dark blue
  PRIMARY: '#2196F3', // blue
  PRIMARY_LIGHT: '#BBDEFB', // light blue
  WHITE: '#FFFFFF', // white
  ACCENT: '#FF5722', // orange
  PRIMARY_TEXT: '#212121', // almost black
  SECONDARY_TEXT: '#727272', // mid grey
  DIVIDER: '#B6B6B6', // light grey
};

function hover(styles) {
  return {':hover': styles};
}

function pos(top, right, bottom, left) {
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

function padding(top, right, bottom, left) {
  return {
    paddingTop: top,
    paddingRight: right,
    paddingLeft: left,
    paddingBottom: bottom,
  };
}

function margin(top, right, bottom, left) {
  return {
    marginTop: top,
    marginRight: right,
    marginLeft: left || right,
    marginBottom: bottom || top,
  };
}

function background(rules) {
  const result = {};

  if (rules.image) result.backgroundImage = rules.image;
  if (rules.positionX) result.backgroundPositionX = rules.positionX;
  if (rules.positionY) result.backgroundPositionY = rules.positionY;
  if (rules.repeat) result.backgroundRepeat = rules.repeat;
  if (rules.size) result.backgroundSize = rules.size;

  return result;
}

function forSize(query, rules) {
  return {
    [query]: rules,
  };
}

export default {
  BREAKPOINT_SIZES,
  BREAKPOINTS,
  DIMENSIONS,
  COLORS,
  hover,
  pos,
  padding,
  margin,
  background,
  forSize,
  shadow: (size = 'large') => {
    const px = size === 'large' ? '10px' : '5px';

    return {
      boxShadow: `0 0 ${px} black`,
    };
  },
};
