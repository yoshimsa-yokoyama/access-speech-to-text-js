import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import path from 'path'

const isProd = process.env.NODE_ENV === 'production'
const isPre = process.env.NODE_ENV === 'preview'

const config = {
  context: path.join(__dirname, './src'),
  entry: {
    'app': ['babel-polyfill', './js/entry.js'],
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'assets/javascripts/[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          configFile: './.eslintrc',
          failOnError: true,
        },
      },
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => {
                  autoprefixer({
                    browsers: ['ie >= 11', 'Android > 4.4', 'iOS > 9']
                  })
                }
              }
            },
            'resolve-url-loader',
            'stylus-loader',
          ]
        })
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader'
          ]
        })
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true,
          root: path.join(__dirname, './src/html'),
        }
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'file-loader',
        options: {
          context: path.resolve('src/js'),
          name: `assets/imgs/[name].[ext]`,
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader?name=assets/fonts/[name].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      svgs: path.join(__dirname, './src/js/svgs')
    }
  },
  devtool: isProd ? '' : 'inline-source-map',
  devServer: {
    inline: true,
    contentBase: path.join(__dirname, './dist'),
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 3333,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'BASENAME': JSON.stringify(process.env.BASENAME || '/'),
      },
      'API_ENDPOINT': JSON.stringify(isProd ? '' : isPre ? '' : ''),
      'GMAP_API_KEY': JSON.stringify(isProd ? '': ''),
      'DOMAIN_NAME': JSON.stringify(isProd ? '': isPre ? '' : '')
    }),
    new HtmlWebpackPlugin({
      template: 'html/index.pug',
    }),
    new ExtractTextPlugin('assets/stylesheets/app.css', { allChunks: false }),
    new CopyWebpackPlugin([
      {
        context: 'static/api',
        from: '**/*',
        to: 'api'
      },
      {
        context: 'static/fonts',
        from: '**/*',
        to: 'assets/fonts'
      },
      {
        context: 'static/imgs',
        from: '**/*',
        to: 'assets/imgs'
      },
      {
        context: 'static/scripts',
        from: '**/*',
        to: 'assets/javascripts'
      },
      {
        context: 'static/videos',
        from: '**/*',
        to: 'assets/videos'
      },
    ]),
  ]
}

if (isProd) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      parallel: true,
      sourceMap: false,
      warnings: false,
    })
  )
}

export default config
