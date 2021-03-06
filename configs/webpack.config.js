const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const package = require('../package.json');
const webpack = require('webpack');

const images = ['jpeg', 'png', 'svg', 'jpg'];

module.exports = {
  entry: './app.js',
  context: path.resolve(__dirname, '../src'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../public'),
    publicPath: '/'
  },

  mode: 'development',

  resolve: {
    alias: {
      services: path.resolve(__dirname, '../src/services'),
      components: path.resolve(__dirname, '../src/components'),
      store: path.resolve(__dirname, '../src/store'),
    }
  },

  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      // },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-regenerator',
            ]
          }
        }
      },
      {
        test: /\s?.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {loader: "css-loader"},
          {loader: "sass-loader"}
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
              name: 'images/[name].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: package.name,
      template: './index.html',
      version: package.version
    }),
    new MiniCssExtractPlugin({filename: 'styles.css'}),
    new webpack.ProvidePlugin({
      React: 'react',
      Component: ['react', 'Component']
    }),
    new CopyWebpackPlugin(
      images.map(etx => ({
        from: `**/*/*.${etx}`,
        to: 'images/[name].[ext]'
      }))
    )
  ],

  devServer: {
    publicPath: '/',
    port: 5000,
    historyApiFallback: true
  },

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
