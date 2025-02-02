import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig } from 'vite';

const htmlFiles: string[] = ['./index.html', './home.html'];

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
  esbuild: {
    target: 'es2022',
  },
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
