const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  performance: {
    // Ignore warnings about vendor bundle being too big (of course it is)
    assetFilter: (name) => !/^vendor\./.test(name),
  },
  // Specify several entry points if necessary
  entry: {
    main: "./src/index.tsx",
  },
  output: {
    filename: "[name].[chunkhash:8].js",
    path: __dirname + "/build"
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  optimization: {
    splitChunks: {
      cacheGroups: {
        // put all vendor scripts and css into a single chunk
        vendor: {
          chunks: 'all',
          name: 'vendor',
          reuseExistingChunk: true,
          test: /[\\\/]node_modules[\\\/]/,
          filename: '[name].[chunkhash:8].js',
          priority: -10,
        },
        default: false,
      }
    }
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      // Translate es6 to es5 using babel
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      // Allow loading/extracting css
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ]
      },
      // Allow less stylesheets
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'less-loader',
        ]
      },
    ]
  },

  plugins: [
    // Remove previous build
    new CleanWebpackPlugin(['build']),
    // Copy static files
    new CopyWebpackPlugin([{from: 'static', to: '.'}], {}),
    // Insert js/css into html template
    new HtmlWebpackPlugin({template: 'src/index.html'}),
    // Split css into separate files
    new MiniCssExtractPlugin({
      filename: "[name].[chunkhash:8].css",
      chunkFilename: "[name].[chunkhash:8].css"
    }),
  ],
  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
  }
};
