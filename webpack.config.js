const path = require('path')

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
      '@uselife/useform': path.resolve(__dirname, 'src/useForm')
    }
  }
}
