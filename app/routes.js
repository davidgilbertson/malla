import React from 'react';
import {Route, IndexRoute} from 'react-router';

import {selectProject} from './data/actionCreators.js';
import App from './components/App/App.jsx';
import HomePage from './components/HomePage/HomePage.jsx';
import ProjectPage from './components/ProjectPage/ProjectPage.jsx';
import {isClient} from './utils.js';
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
      path="/project/:projectSlug/:projectId"
      component={ProjectPage}
      onEnter={nextState => {
        tracker.setPage('project');
        if (isClient) selectProject(nextState.params.projectId);
      }}
    />
  </Route>
);
