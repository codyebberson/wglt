import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig } from 'vite';

// Vite is used for the development server and the website.
// ESBuild is used for the published library.
// This allows us to use the Vite "Multi-Page App" feature.
// Each example is its own Vite entry point.
// For more details, see:
// https://vitejs.dev/guide/build.html#multi-page-app

const htmlFiles: string[] = ['./index.html'];

function findFiles(dir: string): void {
  for (const file of readdirSync(dir)) {
    const path = join(dir, file);
    if (statSync(path).isDirectory()) {
      findFiles(path);
    } else if (file.endsWith('.html')) {
      htmlFiles.push(path.replaceAll('\\', '/'));
    }
  }
}

findFiles('./examples');

const input = Object.fromEntries(
  htmlFiles.map((file) => [file.replace('./', ''), resolve(__dirname, file)])
);

export default defineConfig({
  base: '',
  build: {
    rollupOptions: {
      input,
    },
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      wglt: resolve(__dirname, '../wglt/src'),
    },
  },
});
