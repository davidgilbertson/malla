import * as CSS from '../../utils/css';

export default {
  main: {
    width: CSS.DIMENSIONS.LAYOUT.TOOLBAR_WIDTH,
    position: 'absolute',
    ...CSS.pos(CSS.DIMENSIONS.LAYOUT.HEADER_HEIGHT, null, 0, 0),
    backgroundColor: CSS.COLORS.SECONDARY_50,
    color: CSS.COLORS.BLACK,
  },
};
