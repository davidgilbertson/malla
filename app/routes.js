import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App/App.jsx';
import HomePage from './components/HomePage/HomePage.jsx';
import ScreenPage from './components/ScreenPage/ScreenPage.jsx';
import * as tracker from './tracker.js';

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
      onEnter={() => {
        tracker.setPage('screen');
      }}
    />
  </Route>
);
