import path from 'path'
import webpack from 'webpack'

module.exports = {
  entry: './src/markdown-tokenizer.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'markdown-tokenizer.js',
    library: 'MarkdownTokenizer',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      }
    ]
  },
}
