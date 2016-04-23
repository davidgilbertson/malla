import React from 'react';
import Radium, {Style} from 'radium';

import Header from '../Header/Header.jsx';
import Body from '../Body/Body.jsx';
import Toolbar from '../Toolbar/Toolbar.jsx';

const styleRules = {
  html: {
    'box-sizing': 'border-box',
  },
  '*': {
    'box-sizing': 'inherit',
  },
  body: {
    padding: 0,
    margin: 0,
    overflowY: 'scroll',
    fontFamily: 'sans-serif',
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
    <Style
      rules={styleRules}
    />
    <Header />

    <Body />

    <Toolbar />
  </div>
);

export default Radium(Page);
