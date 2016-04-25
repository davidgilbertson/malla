require('babel-register');

const path = require('path');
const webpack = require('webpack');

const config = {
  entry: [
    'babel-polyfill',
    './app/client.js',
  ],
  output: {
    path: path.resolve(__dirname, '../public/js'),
    filename: 'main.js', // todo hash
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          compact: true,
        },
      },
    ],
  },
  // resolve: {
  //   alias: {
  //     react$: path.resolve(__dirname, '../node_modules/react/dist/react.js'), // for dev
  //     'react-dom$': path.resolve(__dirname, '../node_modules/react-dom/dist/react-dom.js'),
  //   },
  // },
  bail: true,
};

console.log('Starting build');
const startTime = new Date().getTime();

webpack(config, (err) => {
  const endTime = new Date().getTime();

  console.log('done webpacking in', endTime - startTime, 'milliseconds');

  err && console.error(err);
});

