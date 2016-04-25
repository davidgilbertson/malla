import React from 'react';
import CSS from '../../utils/css.js';

const styles = {
  main: {
    position: 'absolute',
    width: 1366,
    height: 768,
    top: 60,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: CSS.COLORS.WHITE,
    backgroundImage: 'url(/images/grid-dot_10x10.gif)',
    ...CSS.shadow('large'),
  },
};

export default () => (
  <div style={styles.main}></div>
);
