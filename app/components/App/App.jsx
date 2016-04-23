import React from 'react';

const {Component} = React;

import Page from '../Page/Page.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    console.log('App.jsx constructor');
  }

  render() {
    return (
      <Page />
    );
  }
}

export default App;
