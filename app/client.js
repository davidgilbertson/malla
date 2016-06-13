import React from 'react';
const {render} = require('react-dom');
require('./utils/normalizeNodeAndBrowser.js');

require('./tracker.js').setBrowserDetails();

import Root from './components/Root/Root.jsx';

render(<Root />, document.getElementById('app'));
