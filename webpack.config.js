const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './app.js',
    // entry: './app/assets/js/codejam-canvas.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {

      rules: [

        /* SASS / SCSS  */
        {
          test: /\.s[ac]ss$/i,
          use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', 'sass-loader']
          })
        },

        /* Fonts */
        {
          test: /\.(woff(2)?|ttf|eot|otf|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
          {
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'assets/fonts/'
                // outputPath: 'fonts/'
            }
          }
          ]
        },

        /* Images */
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
                loader: 'file-loader',
                options: {
                  // outputPath: 'images/',
                  outputPath: 'assets/img/',
                },
            },
          ],
        },
        /* Images */
        {
          test: /\.(png|jpg|gif|svg)$/i,
          use: [
              {
                  loader: 'url-loader',
                  options: {
                    // outputPath: 'images/',
                    outputPath: 'assets/img/',
                  },
              },
          ],
        }
      ]

    },

    plugins: [
      new ExtractTextPlugin( 'style.css' ),
      // new ExtractTextPlugin( 'assets/css/style.css' ),

      new HtmlWebpackPlugin({
          inject: false,
          hash: true,
          // template: './index.html',
          // filename: 'index.html'
          template: './index.html',
          filename: 'index.html'
      }),

      new CopyWebpackPlugin([
          /* Copy images */
          {
            // from: './images',
            // to: 'images'
            from: './assets/img',
            to: 'assets/img'
          } ,
          /* Copy JSON data */
          {
            from: './assets/data',
            to: 'assets/data'
          } ,
          /* Copy Fonts */
          {
            from: './assets/fonts',
            to: 'assets/fonts'
          } ,
          /* CSS Files */
          {
            from: './assets/css',
            to: 'assets/css',
          } ,
          /* main js file */
          {
            from: './script.js',
            to: './'
          } ,
          /* favicon */
          {
            from: './*.ico',
            to: './'
          } ,
      ]),
    ] ,

    devServer: {  // configuration for webpack-dev-server
      contentBase: './',  //source of static assets
      port: 3350, // port to run dev-server
    }

};
