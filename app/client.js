import React from 'react';
const ReactDom = require('react-dom');

import AppContainer from './components/AppContainer/AppContainer.jsx';

ReactDom.render(
  <AppContainer />,
  document.getElementById('app')
);
