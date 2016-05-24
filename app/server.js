const requiredEnvironmentVariables = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_URL',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
];

requiredEnvironmentVariables.forEach(VAR => {
  if (!process.env[VAR]) {
    throw new Error(`No ${VAR} environment variable found.`);
  }
});

import React from 'react';
import {renderToString} from 'react-dom/server';
import express from 'express';
import compression from 'compression';
import {match} from 'react-router';
import {StyleRoot} from 'radium';

import firebaseMiddleware from './server/firebaseMiddleware.js';
import {
  VENDORS,
  WORDS,
} from './constants.js';
import routes from './routes.js';
import store from './data/store.js';
import Root from './components/Root/Root.jsx';

const app = express();
app.use(compression());
app.use(express.static('public', {maxAge: '1000d'}));

const port = process.env.PORT || 8080;

const fileNames = require('../build/stats/fileNames.json');

const adWordsSrc = '//www.googleadservices.com/pagead/conversion_async.js';
const adWordsSnippet = `
/* <![CDATA[ */
goog_snippet_vars = function() {
  var w = window;
  w.google_conversion_id = 1003738231;
  w.google_conversion_label = "oJ5mCL7h7WYQ96jP3gM";
  w.google_remarketing_only = false;
}
// DO NOT CHANGE THE CODE BELOW.
goog_report_conversion = function(url) {
  goog_snippet_vars();
  window.google_conversion_format = "3";
  var opt = new Object();
  opt.onload_callback = function() {
  if (typeof(url) != 'undefined') {
    window.location = url;
  }
}
  var conv_handler = window['google_trackConversion'];
  if (typeof(conv_handler) == 'function') {
    conv_handler(opt);
  }
}
/* ]]> */
`;

const googleAnalyticsSnippet = `
    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga('create', '${VENDORS.GOOGLE_ANALYTICS_TRACKING_ID}', 'auto');
`;

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
          <title>${WORDS.MALLA} | ${WORDS.SLOGAN}</title>
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

          <script>${googleAnalyticsSnippet}</script>
          <script async src='https://www.google-analytics.com/analytics.js'></script>
      </head>
      <body>
          <div id="app">${appHtml}</div>
      
          <script src="https://www.gstatic.com/firebasejs/live/3.0/firebase.js"></script>
          <script>${adWordsSnippet}</script>
          <script type="text/javascript" src="${adWordsSrc}"></script>
          <script async src="${scriptSrc}"></script>
      </body>
      </html>`;

  return html;
}

app.get('/api/:projectId.*json', firebaseMiddleware);

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
