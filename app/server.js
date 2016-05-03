import React from 'react';
import ReactDomServer from 'react-dom/server';
import {Provider} from 'react-redux';
import express from 'express';
import compression from 'compression';

import App from './components/App/App.jsx';
import store from './data/store.js';

const app = express();
app.use(compression());
app.use(express.static('public', {maxAge: '1000d'}));

const port = process.env.PORT || 8080;

import fileNames from './fileNames.json';

app.get('/', (req, res) => {
  const appHtml = ReactDomServer.renderToString(
    <Provider store={store}>
      <App radiumConfig={{userAgent: req.headers['user-agent']}} />
    </Provider>,
  );

  const scriptSrc = process.env.APP_ENV === 'DEV'
    ? 'http://localhost:8081/webpack-bundle.js'
    : `js/${fileNames.mainJs}`;

  const html =
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Malla | Wireframe CMS</title>
    <script>window.MALLA_STATE=${JSON.stringify(store.getState())};</script>
</head>
<body>
    <div id="app">${appHtml}</div>

    <script src="https://cdn.firebase.com/js/client/2.4.2/firebase.js"></script>
    <script async src="${scriptSrc}"></script>
</body>
</html>`;

  res.send(html);
});

app.listen(port, '0.0.0.0', (err) => {
  err && console.error(err);
  console.log(`App listening on port ${port}`);
});
