import commonjs from '@rollup/plugin-commonjs'; // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from '@rollup/plugin-buble'; // Transpile/polyfill with reasonable browser support
import postcss from 'rollup-plugin-postcss';

export default [{
  input: 'src/index.js', // Path relative to package.json
  output: [
    {
      globals: {
        vue: 'vue'
      },
      file: 'dist/index.esm.js',
      format: 'es',
    },
    {
      globals: {
        vue: 'vue'
      },
      name: 'YoValidator',
      exports: 'named',
      file: 'dist/index.umd.js',
      format: 'umd',
    },
    {
      globals: {
        vue: 'vue'
      },
      name: 'YoValidator',
      exports: 'named',
      file: 'dist/index.min.js',
      format: 'iife',
    },
  ],
  plugins: [
    vue(),
    postcss(),
    commonjs(),
    buble() // Transpile to ES5
  ],
  external: [
    'vue'
  ]
}, {
  input: 'src/validator/index.js', // Path relative to package.json
  output: [
    {
      file: 'dist/validator.esm.js',
      format: 'es',
    },
    {
      name: 'YoValidator',
      exports: 'named',
      file: 'dist/validator.umd.js',
      format: 'umd',
    },
    {
      name: 'YoValidator',
      exports: 'named',
      file: 'dist/validator.min.js',
      format: 'iife',
    },
  ],
  plugins: [
    commonjs(),
    buble() // Transpile to ES5
  ]
}];
