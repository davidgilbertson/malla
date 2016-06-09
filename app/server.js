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
  cacher,
} from './utils';

import routes from './routes.js';
import store from './data/store.js';
import Root from './components/Root/Root.jsx';
import * as thirdPartyScripts from './server/thirdPartyScripts.js'
import * as mallaText from './data/loadMallaText.js';

const app = express();
app.use(compression());
app.use(express.static('public', {maxAge: '1000d'}));

mallaText.startListening();
const port = process.env.PORT || 8080;

const fileNames = require('../build/stats/fileNames.json');


function getHtml(req, props, MALLA_TEXT) {
  global.MALLA_TEXT = MALLA_TEXT;
  
  let mallaScriptSrc;

  if (process.env.NODE_ENV === 'development') {
    mallaScriptSrc = 'http://localhost:8081/webpack-bundle.js';
  } else {
    mallaScriptSrc = `/js/${fileNames.mainJs}`;
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
          <title>${MALLA_TEXT.title} | ${MALLA_TEXT.slogan}</title>
          <meta name="description" content="${MALLA_TEXT.title} | ${MALLA_TEXT.slogan}">
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
          
          <script>window.MALLA_TEXT=${JSON.stringify(MALLA_TEXT)};</script>
          <script>window.MALLA_STATE=${JSON.stringify(store.getState())};</script>
          <script>window.MALLA_CONSTANTS=${JSON.stringify(MALLA_CONSTANTS)};</script>
          
          <link href="${thirdPartyScripts.googleFontsSrc}" rel="stylesheet" type="text/css">

          <script>${thirdPartyScripts.googleAnalyticsSnippet}</script>
      </head>
      
      <body>
          <div id="app">${appHtml}</div>
      
          <script>${thirdPartyScripts.adWordsSnippet}</script>
          <script>${thirdPartyScripts.facebookSnippet}</script>
          
          <script async src="${thirdPartyScripts.googleAnalyticsSrc}"></script>
          <script async src="${thirdPartyScripts.adWordsSrc}"></script>
          <script async src="${mallaScriptSrc}"></script>
      </body>
      </html>`;

  return html;
}

app.get('/api/:projectId.*json', firebaseMiddleware);

function handleRoutes(req, res) {
  match({routes: routes, location: req.url}, (err, redirect, props) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirect) {
      res.redirect(redirect.pathname + redirect.search);
    } else if (props) {

      mallaText
        .getText()
        .then(mallaText => {
          const responsePayload = getHtml(req, props, mallaText);
          cacher.cacheResponse(req, responsePayload);
          res.send(responsePayload);
        })
    } else {
      res.status(404).send('Not Found');
    }
  });
}

app.get('*', (req, res) => {
  const cachedResponse = cacher.load(req);

  if (cachedResponse) {
    res.send(cachedResponse);
  } else {
    handleRoutes(req, res);
  }
});

app.listen(port, '0.0.0.0', (err) => {
  err && console.error(err);
  console.log(`> App listening on port ${port}`);
});
