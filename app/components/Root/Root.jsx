import React from 'react';
import {Provider} from 'react-redux';
import {Router, RouterContext, browserHistory} from 'react-router';
import {StyleRoot} from 'radium';

import routes from '../../routes.js';
import store from '../../data/store.js';

export default (props) => {
  let routeWrapper;
  let radiumConfig;
    
  if (typeof window !== 'undefined') {
    routeWrapper = <Router routes={routes} history={browserHistory} />;
  } else {
    routeWrapper = <RouterContext {...props} />;
    radiumConfig = props.radiumConfig
  }
  
  return (
    <Provider store={store}>
      <StyleRoot radiumConfig={radiumConfig}>
        {routeWrapper}
      </StyleRoot>
    </Provider>
    );
};
