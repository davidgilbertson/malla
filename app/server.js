import React from 'react';
import ReactDomServer from 'react-dom/server';
import {Provider} from 'react-redux';
import express from 'express';
import compression from 'compression';

import AppContainer from './components/AppContainer/AppContainer.jsx';
import store from './data/store.js';

const app = express();
app.use(compression());
app.use(express.static('public', {maxAge: '1000d'}));

const port = process.env.PORT || 8080;

const fileNames = require('../build/stats/fileNames.json');

app.get('/', (req, res) => {
  const appHtml = ReactDomServer.renderToString(
    <AppContainer radiumConfig={{userAgent: req.headers['user-agent']}} />
  );

  let scriptSrc;
  let googleAnalyticsScript = '';

  if (process.env.APP_ENV === 'DEV') {
    scriptSrc = 'http://localhost:8081/webpack-bundle.js';
  } else {
    scriptSrc = `js/${fileNames.mainJs}`;
    googleAnalyticsScript = `
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      
        ga('create', 'UA-77392102-1', 'auto');
        ga('send', 'pageview');
      
      </script>
    `;
  }

  const html =
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Malla | The visual CMS</title>
    <meta name="description" content="Malla is a crazy-fast, visual CMS">
    <script>window.MALLA_STATE=${JSON.stringify(store.getState())};</script>
    <link href='https://fonts.googleapis.com/css?family=Roboto+Slab|Open+Sans:400,300' rel='stylesheet' type='text/css'>
</head>
<body>
    <div id="app">${appHtml}</div>

    <script src="https://cdn.firebase.com/js/client/2.4.2/firebase.js"></script>
    <script async src="${scriptSrc}"></script>
    ${googleAnalyticsScript}
</body>
</html>`;

  res.send(html);
});

app.listen(port, '0.0.0.0', (err) => {
  err && console.error(err);
  console.log(`App listening on port ${port}`);
});
