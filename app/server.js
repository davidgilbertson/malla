console.log('server.js');
import express from 'express';
import React from 'react';
import ReactDomServer from 'react-dom/server';
import App from './components/App/App.jsx';
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  const appHtml = ReactDomServer.renderToString(<App />);

  const scriptSrc = process.env.APP_ENV === 'DEV'
    ? 'http://localhost:8081/webpack-bundle.js'
    : 'main.js';

  const html =
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Malla | Wireframe CMS</title>
</head>
<body>
    <div id="app">${appHtml}</div>

    <script src="${scriptSrc}"></script>
</body>
</html>`;

  res.send(html);
});

app.listen(process.env.PORT || 8080, (err) => {
  err && console.error(err);
  console.log('Server running, woot.');
});
