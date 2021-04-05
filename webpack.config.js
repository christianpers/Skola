var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  devServer: {
    contentBase: './dist',
    historyApiFallback: {
      index: 'index.html'
    }
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        loaders: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'Custom template',
    // Load a custom template (lodash by default)
    template: './dist/template.html',
    hash: true,
    apiKeys: {
      firebase: {
        key: 'AIzaSyAblQQ3bFiR5d5Vd4wCex3N7fsGZCk6wFQ',
        authDomain: "skola-39370.firebaseapp.com",
        databaseURL: "https://skola-39370.firebaseio.com",
        projectId: "skola-39370",
        storageBucket: "skola-39370.appspot.com",
        messagingSenderId: "792261340682"
      }
    }
  })],
};