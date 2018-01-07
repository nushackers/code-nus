require('dotenv').config();

const GitHubApi = require('github');
const { GraphQLClient } = require('graphql-request');

const token = process.env.GITHUB_TOKEN;
if (!token) {
  throw new Error('No token found. Make sure .env file exists!');
}

const restApi = new GitHubApi({
  debug: process.env.NODE_ENV !== 'production',
});

restApi.authenticate({
  type: 'token',
  token,
});

const graphqlApi = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
  },
});

module.exports = {
  restApi,
  graphqlApi,
};
