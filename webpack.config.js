const fs = require('fs');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const entries = ['./src/wglt.ts'];
addDir('./examples/');
addDir('./examples/roguelike/');

function addDir(dir) {
  fs.readdirSync(dir).forEach(file => addFile(dir, file));
}

function addFile(dir, file) {
  if (file.endsWith('.ts')) {
    entries.push(dir + file);
  }
}

function getOutputPath(entry) {
  return path.resolve(__dirname, path.dirname(entry).replace('/src', '/dist'));
}

function getOutputFilename(entry) {
  if (entry === './src/wglt.ts') {
    return 'wglt.js';
  }
  return path.basename(entry).replace('.ts', '.min.js');
}

module.exports = entries.map(entry => ({
  entry: entry,
  output: {
    path: getOutputPath(entry),
    filename: getOutputFilename(entry),
    library: 'wglt',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: '/node_modules/',
        loader: 'babel-loader'
      }
    ]
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
          inline: 2
        },
        mangle: {
          properties: false
        },
        output: {
          ecma: 6,
          comments: false,
          ascii_only: true
        }
      }
    })]
  }
}));
