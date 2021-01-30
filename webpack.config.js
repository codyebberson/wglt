const fs = require('fs');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const addDir = (dir) => fs.readdirSync(dir).forEach((file) => addFile(dir, file));
const addFile = (dir, file) => file.endsWith('.ts') && entries.push(dir + file);
const outputPath = (entry) => path.resolve(__dirname, path.dirname(entry).replace('/src', '/dist'));
const outputFilename = (entry) => entry === './src/wglt.ts' ?
    'wglt.js' : path.basename(entry).replace('.ts', '.min.js');

const entries = ['./src/wglt.ts'];
addDir('./examples/');
addDir('./examples/roguelike/');

module.exports = entries.map((entry) => ({
  entry: entry,
  output: {
    path: outputPath(entry),
    filename: outputFilename(entry),
    library: 'wglt',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: '/node_modules/',
        loader: 'babel-loader',
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        parse: {
          ecma: 8,
        },
        compress: {
          ecma: 6,
          warnings: false,
          comparisons: false,
          inline: 2,
        },
        mangle: {
          properties: false,
        },
        output: {
          ecma: 6,
          comments: false,
          ascii_only: true,
        },
      },
    })],
  },
}));
