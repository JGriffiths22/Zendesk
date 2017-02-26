const path = require('path');

module.exports = {
  entry: `${path.resolve(__dirname, 'src')}/index.jsx`,
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
}
