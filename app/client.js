import React from 'react';
const ReactDom = require('react-dom');
import {Router, browserHistory} from 'react-router';
import {StyleRoot} from 'radium';

import RouterWrapper from './routes.js';

// Note this is similar to what is rendered in server.js but:
// - no userAgent passed to <StyleRoot />
// - browserHistory is passed to <Router />
ReactDom.render(
  <StyleRoot>
    <Router routes={RouterWrapper} history={browserHistory} />
  </StyleRoot>,
  document.getElementById('app')
);
