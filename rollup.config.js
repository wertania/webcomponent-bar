import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

import autoPreprocess from 'svelte-preprocess';

function typeCheck() {
  return {
    writeBundle() {
      require('child_process').spawn('svelte-check', {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });
    },
  };
}

export default {
  input: 'src/ProgressBar.svelte',
  output: [
    { file: pkg.module, format: 'es', sourcemap: false },
    { file: pkg.main, format: 'umd', name: 'ProgressBar', sourcemap: false },
  ],
  plugins: [
    typeCheck(),
    svelte({
      preprocess: autoPreprocess(),
      emitCss: false,
    }),
    typescript({ sourceMap: true }),
    resolve({ browser: true, dedupe: ['svelte'] }),
    commonjs(),
    terser(),
    replace({
      'outros.c.push': 'if (outros === undefined) { block.o(local); return }\noutros.c.push',
    }),
  ],
};
