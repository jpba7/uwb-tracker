const path = require('path');

module.exports = {
  entry: {
    index: './frontend/index.js',
    login: './frontend/login.js'
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, './frontend/static-local'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: { presets: ["@babel/preset-env", "@babel/preset-react"] }
      },
    ]
  },
  devtool: 'source-map',
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  }
};