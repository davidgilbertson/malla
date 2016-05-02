import React from 'react';
import {
  COLORS,
} from '../../constants.js';

const styles = {
  main: {
    flex: '0 0 50px',
    backgroundColor: COLORS.PRIMARY_DARK,
    textAlign: 'center',
  },
  title: {
    fontSize: 25,
    color: COLORS.WHITE,
    padding: '20px 0',
  },
};


export default () => (
  <header style={styles.main}>
    <h1 style={styles.title}>Malla</h1>
  </header>
);
