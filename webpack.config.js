const path = require('path')

console.log(111, {
  '@uselife': path.resolve(__dirname, 'src/')
})

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
      // ,
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader']
      // }
    ]
  },
  resolve: {
    alias: {
      '@uselife': path.resolve(__dirname, 'src/')
    }
  }
}
