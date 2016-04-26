import React from 'react';
import CSS from '../../utils/css.js';

const styles = {
  main: {
    // height: CSS.DIMENSIONS.LAYOUT.HEADER_HEIGHT,
    backgroundColor: CSS.COLORS.PRIMARY_DARK,
    textAlign: 'center',
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100%',
  },
  title: {
    fontSize: 25,
    color: CSS.COLORS.WHITE,
    padding: '20px 0',
  },
};


export default () => (
  <header style={styles.main}>
    <h1 style={styles.title}>Malla</h1>
  </header>
);
