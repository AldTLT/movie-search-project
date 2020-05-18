const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssLoaders = (extra) => {
  const loaders = [ MiniCssExtractPlugin.loader, 'css-loader'];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
}

module.exports = {
  // Директория, с которой работает webpack. Теперь src можно не указывать в пути файлов.
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  // Точка входа
  entry: {
    main: ['@babel/polyfill', './main.js'],
  },
  // Директория для собранных файлов
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.scss', '.png', '.svg'],
    alias: {
      '@sass': path.resolve(__dirname, './src/assets/sass'),
      '@js': path.resolve(__dirname, './src/js'),
      '@image': path.resolve(__dirname, './src/assets/image'),
    }
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
    }),
    new CleanWebpackPlugin(),
    // Копирование объектов из src в dist
    new CopyWebpackPlugin([
      // Копирование favicon.ico
      {
        from: path.resolve(__dirname, './src/assets/image/favicon.ico'),
        to: path.resolve(__dirname, './dist'),
      },
      // Копирование swiper.min.js
      {
        from: path.resolve(__dirname, './node_modules/swiper/js/swiper.min.js'),
        to: path.resolve(__dirname, './dist'),
      },
    ]),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],

  devServer: {
    port: 4200,
  },

  // Модули
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader'),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: ['file-loader'],
      },
      {
        test: /\.js$/,
        exclude: '/node-modules/',
        loader: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
            ]
          }
        }
      }
    ]
  }
}
