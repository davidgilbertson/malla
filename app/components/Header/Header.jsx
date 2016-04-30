import React from 'react';
import {
  COLORS,
} from '../../constants';

const styles = {
  main: {
    backgroundColor: COLORS.PRIMARY_DARK,
    textAlign: 'center',
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100%',
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
