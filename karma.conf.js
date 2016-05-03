module.exports = function(config) {
  config.set({
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'dist/bundle.js',
      'test/index.js'
    ],
    frameworks: [
      'mocha',
      'sinon'
    ],
    singleRun: true,
    colors: true,
    logLevel: config.LOG_WARN,
    browsers: ['PhantomJS'],
    preprocessors: {
      'test/index.js': ['webpack']
    },
    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader'
          }
        ]
      }
    },
    webpackServer: {
      noInfo: true
    },
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is
      // encountered (useful if karma exits without killing phantom).
      exitOnResourceError: true
    }
  });
};
