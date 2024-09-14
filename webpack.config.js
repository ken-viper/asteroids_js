const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][hash][ext][query]'
        }
      },
      {
        test: /\.(wav|mp3|ogg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][hash][ext][query]'
        }
      }
    ],
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 9000,
    open: true,
  },
};
