import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import less from 'rollup-plugin-less';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const config = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/component.js',
      name: 'mountPasswordStrengthComponent',
      format: 'iife'
    },
    {
      file: 'dist/component.min.js',
      name: 'mountPasswordStrengthComponent',
      format: 'iife',
      plugins: [terser()]
    },
    {
      file: 'dist/component.esm.js',
      format: 'esm'
    }
  ],
  plugins: [
    resolve({
      preferBuiltins: false
    }),
    commonjs(),
    less({
      output: 'dist/style.css'
    }),
    babel({
      babelHelpers: 'runtime',
      plugins: [
        '@babel/plugin-transform-runtime'
      ]
    })
  ]
};

export default config;
