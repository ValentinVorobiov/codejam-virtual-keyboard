const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  module: {

    rules: [

      /*  JavaScript  */
      {
        test: /.(js)$/,
        exclude: /node_modules/,
        use: ['eslint-loader'],
      },

      /*      CSS     */
      // {
      //   test: /\.css/i,
      //   use: [
      //     'style-loader',
      //     MiniCssExtractPlugin.loader,
      //     {
      //       loader: 'css-loader',
      //     },
      //   ]
      // },

      /* SASS / SCSS  */
      {
        // test: /\.s[ac]ss$/i,
        test: /\.css|sass|scss$/i,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],

  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    new webpack.LoaderOptionsPlugin({
      test: /.js$/,
      options: {
        eslint: {
          configFile: path.resolve(__dirname, '.eslintrc'), // this is my helper for resolving paths
          cache: false,
        },
      },
    }),
  ],

  devServer: {
    // configuration for webpack-dev-server
    contentBase: './',
    // source of static assets
    port: 3350,
    // port to run dev-server
  },

};
