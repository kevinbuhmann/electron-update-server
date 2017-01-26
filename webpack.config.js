module.exports = {
  target: 'node',
  externals: {
    'express': 'require(\'express\')'
  },
  entry: {
    'server': './src/index.ts',
  },
  output: {
    path: 'dist',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel-loader' ]
      },
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader']
      },
      {
        test: /\.json$/,
        loaders: ['json-loader']
      }
    ]
  }
};
