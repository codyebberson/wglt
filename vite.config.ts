import glob from 'glob';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// Vite is used for the development server and the website.
// Rollup is used for the published library.
// This allows us to use the Vite "Multi-Page App" feature.
// Each example is its own Vite entry point.
// For more details, see:
// https://vitejs.dev/guide/build.html#multi-page-app

const htmlFiles = ['./index.html', ...glob.sync('./examples/**/*.html')];
const input = Object.fromEntries(htmlFiles.map((file) => [file.replace('./', ''), resolve(__dirname, file)]));

export default defineConfig({
  build: {
    rollupOptions: {
      input,
    },
  },
});
