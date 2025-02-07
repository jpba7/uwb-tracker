const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    index: './frontend/index.js',
    login: './frontend/login.js'
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, './frontend/static-local/'),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxAsyncRequests: 30,
      maxInitialRequests: 30
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: { presets: ["@babel/preset-env", "@babel/preset-react"] }
      }
    ]
  }
}