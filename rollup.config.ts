import dts from 'rollup-plugin-dts';

const config = [
  // your default rollup config for transpilation and bundling
  {
    // path to your declaration files root
    input: './src/wglt.ts',
    output: [{ file: 'dist/wglt.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

export default config;
