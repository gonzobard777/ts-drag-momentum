const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const distDirPath = path.resolve(__dirname, 'dist');
const srcDirPath = path.resolve(__dirname, 'src');

module.exports = {
  entry: path.join(srcDirPath, 'index.ts'),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: distDirPath
  },
  devServer: {
    contentBase: distDirPath
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(srcDirPath, 'index.html')
    })
  ]
};
