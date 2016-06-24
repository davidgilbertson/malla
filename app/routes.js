import React from 'react';
import {Route, IndexRoute} from 'react-router';

import store from './data/store.js';
import App from './components/App/App.jsx';
import HomePage from './components/HomePage/HomePage.jsx';
import ScreenPage from './components/ScreenPage/ScreenPage.jsx';
import DocsPage from './components/DocsPage/DocsPage.jsx';
import * as tracker from './tracker.js';
import {ACTIONS} from './constants.js';

export default (
  <Route path="/" component={App}>
    <IndexRoute
      component={HomePage}
      onEnter={() => {
        tracker.setPage('home');
      }}
    />

    <Route
      path="/s/:screenKey/:projectSlug/:screenSlug"
      component={ScreenPage}
      onEnter={state => {
        store.dispatch({
          type: ACTIONS.SET_CURRENT_SCREEN,
          key: state.params.screenKey,
        });

        tracker.setPage('screen');
      }}
    />
    <Route
      path="/docs/getting-started"
      component={DocsPage}
      onEnter={() => {
        tracker.setPage('docs/getting-started');
      }}
    />
  </Route>
);
