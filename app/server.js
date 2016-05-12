if (!process.env.FIREBASE_SECRET) {
  throw new Error('No FIREBASE_SECRET environment variable found.');
}
if (!process.env.FIREBASE_URL) {
  throw new Error('No FIREBASE_URL environment variable found.');
}

import React from 'react';
import {renderToString} from 'react-dom/server';
import express from 'express';
import compression from 'compression';
import {match} from 'react-router';
import {StyleRoot} from 'radium';

import firebaseMiddleware from './server/firebaseMiddleware.js';

import routes from './routes.js';
import store from './data/store.js';
import Root from './components/Root/Root.jsx';

const app = express();
app.use(compression());
app.use(express.static('public', {maxAge: '1000d'}));

const port = process.env.PORT || 8080;

const fileNames = require('../build/stats/fileNames.json');

function getHtml(req, props) {
  let scriptSrc;

  if (process.env.APP_ENV === 'DEV') {
    scriptSrc = 'http://localhost:8081/webpack-bundle.js';
  } else {
    scriptSrc = `/js/${fileNames.mainJs}`;
  }
  
  const appHtml = renderToString(
    <Root {...props} radiumConfig={{userAgent: req.headers['user-agent']}} />
  );

  const html =
    `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Malla | The visual CMS</title>
          <meta name="description" content="Malla is a crazy-fast, visual CMS">
          <link rel="shortcut icon" href="/favicon.ico">
          <link rel="icon" sizes="16x16 32x32 64x64" href="/favicon.ico">
          <link rel="apple-touch-icon" href="/favicon-57.png">
          <link rel="apple-touch-icon" sizes="114x114" href="/favicon-114.png">
          <link rel="apple-touch-icon" sizes="72x72" href="/favicon-72.png">
          <link rel="apple-touch-icon" sizes="144x144" href="/favicon-144.png">
          <link rel="apple-touch-icon" sizes="60x60" href="/favicon-60.png">
          <link rel="apple-touch-icon" sizes="120x120" href="/favicon-120.png">
          <link rel="apple-touch-icon" sizes="76x76" href="/favicon-76.png">
          <link rel="apple-touch-icon" sizes="152x152" href="/favicon-152.png">
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png">
          <meta name="msapplication-TileColor" content="#FFFFFF">
          <meta name="msapplication-TileImage" content="/favicon-144.png">
          <meta name="msapplication-config" content="/browserconfig.xml">
          <script>window.MALLA_STATE=${JSON.stringify(store.getState())};</script>
          <script>window.MALLA_CONSTANTS=${JSON.stringify(MALLA_CONSTANTS)};</script>
          <link href='https://fonts.googleapis.com/css?family=Roboto+Slab:400,300|Open+Sans:400,300' rel='stylesheet' type='text/css'>

          <script>
            window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
            ga('create', '${VENDORS.GOOGLE_ANALYTICS_TRACKING_ID}', 'auto');
            ga('send', 'pageview');
          </script>

          <script async src='https://www.google-analytics.com/analytics.js'></script>
      </head>
      <body>
          <div id="app">${appHtml}</div>
      
          <script src="https://cdn.firebase.com/js/client/2.4.2/firebase.js"></script>
          <script async src="${scriptSrc}"></script>
      </body>
      </html>`;

  return html;
}

app.get('/project/:projectSlug/:projectId.*json', firebaseMiddleware);

app.get('*', (req, res) => {
  match({routes: routes, location: req.url}, (err, redirect, props) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirect) {
      res.redirect(redirect.pathname + redirect.search);
    } else if (props) {
      res.send(getHtml(req, props));
    } else {
      res.status(404).send('Not Found');
    }
  });
});

app.listen(port, '0.0.0.0', (err) => {
  err && console.error(err);
  console.log(`> App listening on port ${port}`);
});
