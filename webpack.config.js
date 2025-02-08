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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 1, // Reduz uso de CPU
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000, // ~240KB por chunk
      maxAsyncRequests: 30,
      maxInitialRequests: 30
    }
  },
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
