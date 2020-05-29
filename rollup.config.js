import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default {
  input: 'src/useForm.ts',
  external: ['react', 'lodash'],
  output: {
    file: pkg.main,
    format: 'es',
    name: 'useForm',
    globals: {
      react: 'React',
      lodash: '_',
    },
    exports: 'named',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      extensions: ['.ts']
    }),
    terser(),
  ],
}
