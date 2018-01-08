/* eslint-disable */
require('dotenv').config();

const { DefinePlugin } = require('webpack');

module.exports = function(config, env, helpers) {
  config.node = {
    process: 'mock',
  };
  config.plugins.push(
    new DefinePlugin({
      'process.env': {
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'ALGOLIA_APP_ID': JSON.stringify(process.env.ALGOLIA_APP_ID),
          'ALGOLIA_SEARCH_API_KEY': JSON.stringify(process.env.ALGOLIA_SEARCH_API_KEY),
      },
    })
  );
}
