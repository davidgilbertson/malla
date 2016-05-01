import React from 'react';
import Radium, {Style} from 'radium';

import Header from '../Header/Header.jsx';
import ScreenContainer from '../ScreenContainer/ScreenContainer.jsx';

const styleRules = {
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
    overflow: 'scroll',
    fontFamily: 'sans-serif',
    height: '100vh', // so the gradient knows to fill the page
    backgroundImage: 'linear-gradient(0deg, rgba(33, 33, 33, 0.9), rgba(33, 33, 33, 0.8))',
  },
  h1: {
    margin: 0,
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
};

const Page = () => (
  <div>
    <Style rules={styleRules} />

    <Header />

    <ScreenContainer />
  </div>
);

export default Radium(Page);
