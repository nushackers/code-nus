/* eslint-disable */
require('dotenv').config();

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const netlifyPlugin = require('preact-cli-plugin-netlify');

module.exports = function(config, env, helpers) {
  config.node = {
    process: 'mock',
  };
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        ALGOLIA_APP_ID: JSON.stringify(process.env.ALGOLIA_APP_ID),
        ALGOLIA_SEARCH_API_KEY: JSON.stringify(process.env.ALGOLIA_SEARCH_API_KEY),
      },
    }),
  );

  const { index } = helpers.getPluginsByName(config, 'CommonsChunkPlugin')[0];
  config.plugins[index] = new webpack.optimize.CommonsChunkPlugin({
    children: true,
    async: false,
    minChunks: 2,
  });

  config.plugins.push(new CopyWebpackPlugin([{ from: './src/assets', context: __dirname }], {
    copyUnmodified: true,
  }));

  netlifyPlugin(config);
};
