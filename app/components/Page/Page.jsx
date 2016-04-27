import React from 'react';
import Radium, {Style} from 'radium';

import Header from '../Header/Header.jsx';
import Screen from '../Screen/Screen.jsx';

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
};

const Page = () => (
  <div>
    <Style rules={styleRules} />

    <Header />

    <Screen />
  </div>
);

export default Radium(Page);
