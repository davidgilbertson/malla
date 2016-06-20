import React from 'react';
import Radium, {Style, StyleRoot} from 'radium';

import {
  COLORS,
  FONT_FAMILIES,
} from '../../constants.js';
import HeaderContainer from '../HeaderContainer/HeaderContainer.jsx';
import PageModalConductor from '../PageModal/PageModalConductor.jsx';
import DropModalConductor from '../DropModal/DropModalConductor.jsx';

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
      backgroundColor: 'transparent',
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
    'input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    'input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  markdown: {
    h1: {
      marginTop: 20,
      fontWeight: 700,
    },
    h2: {
      marginTop: 10,
      fontWeight: 700,
    },
    p: {
      margin: '10px 0',
    },
    a: {
      color: 'blue',
      textDecoration: 'underline',
    },
    ul: {
      paddingLeft: 30,
    },
    img: {
      margin: '-4px -8px', // must be the opposite of TEXT_PADDING
      maxWidth: 'calc(100% + 16px)',
    },
    strong: {
      fontWeight: 700,
    }
  },
};

const App = (props) => (
  <StyleRoot>
    <Style rules={styles.css} />
    <Style
      scopeSelector=".markdown-content"
      rules={styles.markdown}
    />
    
    <HeaderContainer {...props} />

    {props.children}

    <DropModalConductor />
    <PageModalConductor />
  </StyleRoot>
);

export default Radium(App);
