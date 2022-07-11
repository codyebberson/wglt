import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { mkdirSync, writeFileSync } from 'fs';
import { terser } from 'rollup-plugin-terser';

// Vite is used for the development server and the website.
// Rollup is used for the published library.
// We dual build CommonJS and ES modules.

const extensions = ['.ts'];

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/esm/index.min.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: 'dist/cjs/index.js',
      format: 'umd',
      name: 'wglt.core',
      sourcemap: true,
    },
    {
      file: 'dist/cjs/index.min.js',
      format: 'umd',
      name: 'wglt.core',
      plugins: [terser()],
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({ extensions }),
    typescript(),
    {
      buildEnd: () => {
        mkdirSync('./dist/cjs', { recursive: true });
        mkdirSync('./dist/esm', { recursive: true });
        writeFileSync('./dist/cjs/package.json', '{"type": "commonjs"}');
        writeFileSync('./dist/esm/package.json', '{"type": "module"}');
      },
    },
  ],
};
