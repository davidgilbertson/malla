import React from 'react';
import {renderToString} from 'react-dom/server';
import express from 'express';
import compression from 'compression';
import {match, RouterContext} from 'react-router';

import routes from './routes.js';
import store from './data/store.js';
import {StyleRoot} from 'radium';

const app = express();
app.use(compression());
app.use(express.static('public', {maxAge: '1000d'}));

const port = process.env.PORT || 8080;

const fileNames = require('../build/stats/fileNames.json');

const gaScript = `
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-77392102-1', 'auto');
  ga('send', 'pageview');

</script>
`;

function getHtml(req, props) {
  let scriptSrc;
  let googleAnalyticsScript = '';

  if (process.env.APP_ENV === 'DEV') {
    scriptSrc = 'http://localhost:8081/webpack-bundle.js';
  } else {
    scriptSrc = `js/${fileNames.mainJs}`;
    googleAnalyticsScript = gaScript;
  }
  
  // Note this is similar to what is rendered in client.js but:
  // - userAgent is passed to <StyleRoot />
  // - browserHistory is not passed and <RouterContext /> is used instead of <Router />
  const appHtml = renderToString(
    <StyleRoot radiumConfig={{userAgent: req.headers['user-agent']}}>
      <RouterContext {...props} />
    </StyleRoot>
  );

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

  return html;
}

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
  console.log(`App listening on port ${port}`);
});
