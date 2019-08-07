import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: 'src/useForm.js',
  external: ['react', 'lodash'],
  output: {
    format: 'umd',
    name: 'useForm',
    globals: {
      react: 'React',
      lodash: '_'
    },
    exports: 'named'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}
