'use strict';

const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const isProduction = false; //(env === 'production');

let plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.DedupePlugin(),
  new webpack.NoErrorsPlugin()
];

if (isProduction) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: true,
        unsafe: true
      }
    })
  );
}

module.exports = {
  devtool: !isProduction ? 'cheap-source-map' : 'eval',
  entry: './src/index.js',
  watch: true,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'var',
    library: 'ajax'
  },
  resolve: {
    root: path.join(__dirname, 'dist')
  },
  plugins: plugins,
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        include: path.join(__dirname, 'src')
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        include: path.join(__dirname, 'src')
      }
    ]
  }
};
