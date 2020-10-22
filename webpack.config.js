const fs = require('fs');
const path = require('path');
const Terser = require('terser-webpack-plugin');

const entries = ['./src/index.js'];
addDir('./examples/');
addDir('./examples/roguelike/');

function addDir(dir) {
  fs.readdirSync(dir).forEach(file => addFile(dir, file));
}

function addFile(dir, file) {
  if (file.endsWith('.js') && !file.endsWith('.min.js')) {
    entries.push(dir + file);
  }
}

function getOutputPath(entry) {
  return path.resolve(__dirname, path.dirname(entry).replace('/src', '/dist'));
}

function getOutputFilename(entry) {
  return path.basename(entry).replace('.js', '.min.js');
}

module.exports = entries.map(entry => ({
  entry: entry,
  output: {
    path: getOutputPath(entry),
    filename: getOutputFilename(entry),
    libraryTarget: 'umd'
  },
  optimization: {
    minimizer: [new Terser()]
  }
}));
