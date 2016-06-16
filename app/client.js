import React from 'react';
const {render} = require('react-dom');
require('./utils/normalizeNodeAndBrowser.js');

require('./tracker.js').setBrowserDetails();

// if (process.env.NODE_ENV !== 'production') {
//   window.Perf = require('react-addons-perf');
//   Perf.start();
//   console.warn('React Perf is running. You should Perf.stop() it');
// }

import Root from './components/Root/Root.jsx';

render(<Root />, document.getElementById('app'));
