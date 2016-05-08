import React from 'react';
import Radium, {Style, StyleRoot} from 'radium';
import {Provider} from 'react-redux';

import store from '../../data/store';
import {
  FONT_FAMILIES,
} from '../../constants.js';
import HeaderContainer from '../HeaderContainer/HeaderContainer.jsx';
import ModalContainer from '../ModalContainer/ModalContainer.jsx';

const styles = {
  css: {
    html: {
      boxSizing: 'border-box',
    },
    '*': {
      boxSizing: 'inherit',
    },
    '*:before': {
      boxSizing: 'inherit',
    },
    '*:after': {
      boxSizing: 'inherit',
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
    a: {
      color: 'inherit',
      textDecoration: 'none',
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
    },
    textarea: {
      color: 'inherit',
      fontFamily: 'inherit',
      fontWeight: 'inherit',
      fontSize: 'inherit',
    }
  }
};

const App = (props) => (
  <Provider store={store}>
    <StyleRoot>
      <Style rules={styles.css} />
      
      <HeaderContainer {...props} />

      {props.children}

      <ModalContainer />
    </StyleRoot>
  </Provider>
);

export default Radium(App);
