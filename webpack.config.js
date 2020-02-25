const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'less-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      assets: path.resolve(__dirname, 'src/assets'),
    },
  },
  plugins: [new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public/index.html') })],
  devServer: {
    port: 9000,
    contentBase: path.resolve(__dirname, 'dist'),
    progress: true,
    hot: true,
    open: true,
  },
};
