import React from 'react';
import Radium, {Style, StyleRoot} from 'radium';

import {
  COLORS,
  FONT_FAMILIES,
} from '../../constants.js';
import HeaderContainer from '../HeaderContainer/HeaderContainer.jsx';
import ModalContainer from '../ModalContainer/ModalContainer.jsx';
import DropModal from '../DropModal/DropModal.jsx';

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
      fontWeight: '300',
    },
    h2: {
      margin: 0,
      fontWeight: '300',
    },
    p: {
      margin: 0,
      lineHeight: 1.6,
    },
    li: {
      lineHeight: 1.6,
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
    code: {
      padding: '0.2em 0.5em',
      backgroundColor: COLORS.OFF_WHITE,
      borderRadius: 3,
      fontFamily: FONT_FAMILIES.MONOSPACE,
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
    input: {
      color: 'inherit',
      fontFamily: 'inherit',
      fontWeight: 'inherit',
      fontSize: 'inherit',
    },
    textarea: {
      color: 'inherit',
      fontFamily: 'inherit',
      fontWeight: 'inherit',
      fontSize: 'inherit',
    },
  }
};

const App = (props) => (
  <StyleRoot>
    <Style rules={styles.css} />
    
    <HeaderContainer {...props} />

    {props.children}

    <ModalContainer />
    <DropModal />
  </StyleRoot>
);

export default Radium(App);
