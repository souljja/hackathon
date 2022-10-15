const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const isDevMode = argv.mode === 'development';

  return {
    mode: argv.mode,
    entry: './src/index.tsx',
    output: {
      filename: '[contenthash].bundle.js',
      chunkFilename: '[contenthash].chunk.js',
      path: path.resolve(process.cwd(), 'dist'),
      clean: true,
    },
    target: 'web',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@': path.resolve(__dirname, '/src'),
        assets: path.resolve(__dirname, 'assets'),
      },
    },
    devServer: {
      historyApiFallback: true,
      open: true,
      compress: true,
      hot: true,
      port: 8080,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        base: '/',
        scriptLoading: 'defer',
      }),
      ...(isDevMode
          ? [
            new CircularDependencyPlugin({
              exclude: /node_modules/,
              failOnError: true,
            }),
          ]
          : []),
    ],
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: path.resolve(__dirname, 'node_modules'),
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(jpg|jpeg|gif|png)/,
          type: 'asset/resource',
          generator: {
            filename: 'static/img/[hash][ext]',
          },
        },
        {
          test: /\.(ttf|woff|woff2|otf)/,
          type: 'asset/resource',
          generator: {
            filename: 'static/fonts/[hash][ext]',
          },
        },
        {
          test: /\.svg/,
          type: 'asset/inline',
        },
      ],
    },
    optimization: {
      minimize: !isDevMode,
      chunkIds: 'named',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            enforce: true,
          },
        },
      },
    },
  };
};
