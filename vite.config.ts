import { resolve } from 'node:path';
import { globSync } from 'glob';
import { defineConfig } from 'vitest/config';

// Vite is used for the development server and the website.
// ESBuild is used for the published library.
// This allows us to use the Vite "Multi-Page App" feature.
// Each example is its own Vite entry point.
// For more details, see:
// https://vitejs.dev/guide/build.html#multi-page-app

const htmlFiles = ['./index.html', ...globSync('./examples/**/*.html')];
const input = Object.fromEntries(
  htmlFiles.map((file) => [file.replace('./', ''), resolve(__dirname, file)])
);

export default defineConfig({
  build: {
    rollupOptions: {
      input,
    },
  },
  server: {
    port: 3000,
  },
  test: {
    globals: true,
  },
});
