require('babel-register');
require('../app/server.js'); // we also run the normal server

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const contentBase = 'http://localhost:8081';

const config = {
  entry: [
    'babel-polyfill',
    `webpack-dev-server/client?${contentBase}`,
    'webpack/hot/only-dev-server',
    './app/client.js',
  ],
  output: {
    path: path.resolve(__dirname, '../public'),
    publicPath: `${contentBase}/`,
    filename: 'webpack-bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: [
          'react-hot',
          'babel',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json',
        exclude: /node_modules/,
      },
    ],
  },
  // resolve: {
  //   alias: {
  //     react$: path.resolve(__dirname, '../node_modules/react/dist/react.js'), // for dev
  //     'react-dom$': path.resolve(__dirname, '../node_modules/react-dom/dist/react-dom.js'),
  //   },
  // },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};

const compiler = webpack(config);

const devServerOptions = {
  contentBase,
  publicPath: config.output.publicPath,
  // historyApiFallback: true,
  // historyApiFallback: {
  //   index: `${contentBase}/`,
  // },
  hot: true,
  noInfo: true,
  stats: {
    colors: true,
  },
};

const webpackDevServer = new WebpackDevServer(compiler, devServerOptions);

webpackDevServer.listen(8081);
