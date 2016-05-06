import React from 'react';
import Radium, {Style, StyleRoot} from 'radium';

import {
  FONT_FAMILIES,
} from '../../constants.js';

import HomePage from '../HomePage/HomePage.jsx';
import HeaderContainer from '../HeaderContainer/HeaderContainer.jsx';
import ScreenContainer from '../ScreenContainer/ScreenContainer.jsx';
import ModalContainer from '../ModalContainer/ModalContainer.jsx';

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  css: {
    html: {
      'box-sizing': 'border-box',
    },
    '*': {
      'box-sizing': 'inherit',
    },
    '*:before': {
      'box-sizing': 'inherit',
    },
    '*:after': {
      'box-sizing': 'inherit',
    },
    body: {
      padding: 0,
      margin: 0,
      fontFamily: FONT_FAMILIES.SANS_SERIF,
      fontWeight: 300,
    },
    h1: {
      margin: 0,
      letterSpacing: 1,
      lineHeight: 1,
      fontWeight: '300',
    },
    h2: {
      margin: 0,
      lineHeight: 1,
      fontWeight: '300',
    },
    p: {
      margin: 0,
      lineHeight: 1.6,
    },
    button: {
      background: 'none',
      border: 0,
      color: 'inherit',
      fontFamily: 'inherit',
      fontWeight: 300,
      fontSize: 'inherit',
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: 1,
    }
  }
};

const App = () => (
  <StyleRoot>
    <div style={styles.app}>
      <Style rules={styles.css} />

      {/*<HeaderContainer />*/}

      {/*<ScreenContainer />*/}

      <HomePage />

      <ModalContainer />
    </div>
  </StyleRoot>
);

export default Radium(App);
