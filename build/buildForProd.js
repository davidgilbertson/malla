require('babel-register');

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');

rimraf.sync(path.resolve(__dirname, '../public/js'));

const config = {
  entry: [
    'babel-polyfill',
    './app/client.js',
  ],
  output: {
    path: path.resolve(__dirname, '../public/js'),
    filename: 'main.[hash].js', // todo hash
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
  bail: true,
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
    }),
    // TODO (davidg): speed test these when the app is bigger
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
};

console.log('Starting build');
const startTime = new Date().getTime();

webpack(config, (err, stats) => {
  const endTime = new Date().getTime();

  console.log('done webpacking in', endTime - startTime, 'milliseconds');

  err && console.error(err);

  const fileNames = {
    mainJs: stats.toJson().assetsByChunkName.main,
  };

  fs.writeFile(path.resolve(__dirname, '../app/fileNames.json'), JSON.stringify(fileNames), 'utf8');
});

