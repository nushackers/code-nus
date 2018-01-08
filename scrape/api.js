const GitHubApi = require('github');
const { GraphQLClient } = require('graphql-request');
const algoliasearch = require('algoliasearch');

const token = process.env.GITHUB_TOKEN;
if (!token && process.env.NODE_ENV === 'production') {
  throw new Error('No token found. Make sure .env file exists!');
}

const ghRestApi = new GitHubApi({
  debug: process.env.NODE_ENV !== 'production',
});

ghRestApi.authenticate({
  type: 'token',
  token,
});

const ghGraphqlApi = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
  },
});
/**
 * Algo docs: https://www.algolia.com/doc/api-client/javascript/getting-started/
 */
const client = algoliasearch(process.ENV.ALGOLIA_APP_ID, process.ENV.ALGOLIA_API_KEY);
const algoliaProjectsIndex = client.initIndex('code@nus_projects');
const algoliaUsersIndex = client.initIndex('code@nus_users');

module.exports = {
  ghRestApi,
  ghGraphqlApi,
  algoliaProjectsIndex,
  algoliaUsersIndex,
};
