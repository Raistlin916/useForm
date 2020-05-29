import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
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
    typescript(),
    babel({
      exclude: 'node_modules/**',
    }),
    terser(),
  ],
}
