var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var poststylus = require('poststylus');

var node_modules = path.resolve(__dirname, '../node_modules');

var basename = '/';

module.exports = {
  entry:{
    app: [
      'babel-polyfill',
      path.resolve(__dirname, '../app/main.js'),
    ],
  },
  resolve: {
    alias: {},
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    publicPath: basename,
    filename: '[name].js',
  },
  externals: {},
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: node_modules,
        loader: 'babel-loader',
        query: {
          plugins: [
            ['module-resolver', {
              root: [path.resolve(__dirname, '../app/')],
            }],
          ],
        },
      },
      {
        test: /\.(styl|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'stylus-loader',
            options: {
              import: [
                path.resolve(__dirname, '../app/style/variables.styl'),
                path.resolve(__dirname, '../app/style/mixins.styl'),
              ],
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.json$/,
        loader: 'json',
        include: path.resolve(__dirname, '../app/assets/')
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: 'file-loader?name=imgs/[hash].[ext]',
        include: path.resolve(__dirname, '../app/assets/imgs'),
      },
      {
        test: /\.(eot|svg|ttf|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader?name=fonts/[hash].[ext]',
        include: path.resolve(__dirname, '../app/assets/fonts'),
      },
      {
        test: /\.pdf$/,
        loader: 'file?name=[hash].[ext]',
        include: path.resolve(__dirname, '../app/assets')
      },
      { test: /\.(glsl|frag|vert)$/, exclude: node_modules, loader: 'raw' },
      { test: /\.(glsl|frag|vert)$/, exclude: node_modules, loader: 'glslify' }
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: true, drop_console: true, },
      comments: false,
      sourceMap: true,
      mangle: true,
    }),
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production'),
        'BASENAME': JSON.stringify(basename)
      },
    }),
    new ExtractTextPlugin('styles.css', {
      disable: false,
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      template: '../app/assets/index.html',
      favicon: '../app/assets/imgs/favicon.ico',
    })
  ]
};
