import React from 'react';
import {Provider} from 'react-redux';
import store from '../../data/store';

import App from '../App/App.jsx';

const AppContainer = ({radiumConfig}) => (
  <Provider store={store}>
    <App radiumConfig={radiumConfig} />
  </Provider>
);

export default AppContainer;
