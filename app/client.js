import React from 'react';
const ReactDom = require('react-dom');
import {Provider} from 'react-redux';

import App from './components/App/App.jsx';
import store from './data/store';

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
