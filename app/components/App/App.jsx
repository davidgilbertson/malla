import React from 'react';
import Radium, {Style} from 'radium';

import HeaderContainer from '../HeaderContainer/HeaderContainer.jsx';
import ScreenContainer from '../ScreenContainer/ScreenContainer.jsx';
import ModalContainer from '../ModalContainer/ModalContainer.jsx';

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundImage: 'url(/images/grid-dot_10x10.gif)',
    backgroundPosition: '1px 1px',
    cursor: 'crosshair',
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
      fontFamily: 'sans-serif',
    },
    h1: {
      margin: 0,
      letterSpacing: 1,
    },
    h2: {
      margin: 0,
    },
    button: {
      background: 'none',
      border: 0,
      color: 'inherit',
      cursor: 'pointer',
    }
  }
};

const App = () => (
  <div style={styles.app}>
    <Style rules={styles.css} />

    <HeaderContainer />

    <ScreenContainer />

    <ModalContainer />
  </div>
);

export default Radium(App);
