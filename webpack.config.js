const path = require("path");
const webpack = require("webpack");

module.exports = {
  target: "web",
  context: path.join(__dirname, "app"),
  entry: "./index.jsx",
  output: {
    path: path.join(__dirname, "app/static"),
    publicPath: "http://localhost:3000/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.less$/,
        loader: "style!css!less"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: [ "es2015", "stage-2" ]
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          cacheDirectory: true,
          plugins: [ "transform-decorators-legacy" ],
          presets: [ "es2015", "stage-2", "react" ]
        }
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        loader: "file"
      }
    ]
  },
  resolve: {
    root: path.resolve(__dirname, "app"),
    extensions: [ "", ".js", ".jsx" ],
    modulesDirectories: [ "node_modules" ]
  }
};