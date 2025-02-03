import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig } from 'vite';

const ignoredDirs = ['node_modules', '.git', '.turbo', 'dist', 'build', 'out', 'public'];
const htmlFiles: string[] = [];

function findHtmlFiles(dir = '.'): void {
  for (const file of readdirSync(dir)) {
    if (ignoredDirs.includes(file)) {
      continue;
    }
    const path = join(dir, file);
    if (statSync(path).isDirectory()) {
      findHtmlFiles(path);
    } else if (file.endsWith('.html')) {
      htmlFiles.push(path.replaceAll('\\', '/'));
    }
  }
}

findHtmlFiles();

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
