export const BREAKPOINT_SIZES = {
  SMALL_MED: 480,
  MED_LARGE: 880,
  LARGE_JUMBO: 1120,
};

export const BREAKPOINTS = {
  SMALL_ONLY: `@media (max-width: ${BREAKPOINT_SIZES.SMALL_MED}px)`,
  MEDIUM_UP: `@media (min-width: ${BREAKPOINT_SIZES.SMALL_MED}px)`,
  LARGE_UP: `@media (min-width: ${BREAKPOINT_SIZES.MED_LARGE}px)`,
  JUMBO_UP: `@media (min-width: ${BREAKPOINT_SIZES.LARGE_JUMBO}px)`,
};

export const DIMENSIONS = {
  LAYOUT: {
    HEADER_HEIGHT: 100,
    TOOLBAR_WIDTH: 120,
  },
  TEXT: {
    HEADING_1: 40,
    HEADING_2: 30,
    HEADING_3: 20, // TODO: no idea, just messing around
  },
};

// source: https://www.google.com/design/spec/style/color.html#color-color-palette
const RAW_COLORS = {
  PINK_500: '#E91E63',
  INDIGO_500: '#3F51B5',
};

export const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  PRIMARY: RAW_COLORS.INDIGO_500,
  SECONDARY: RAW_COLORS.PINK_500,
  SECONDARY_50: '#E8EAF6',
  GRAY_800: '#424242',
  GRAY_900: '#212121',
};

export function hover(styles) {
  return {':hover': styles};
}

export function pos(top, right, bottom, left) {
  const result = {};

  if (typeof left === 'undefined') {
    console.warn('The pos function needs four positions');
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

export function forSize(query, rules) {
  return {
    [query]: rules,
  };
}
