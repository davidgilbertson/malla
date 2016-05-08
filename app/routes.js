import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App/App.jsx';
import HomePage from './components/HomePage/HomePage.jsx';
import ProjectPage from './components/ProjectPage/ProjectPage.jsx';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    
    <Route path="/project" component={ProjectPage}/>
  </Route>
);
