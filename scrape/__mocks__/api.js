const api = jest.genMockFromModule('../api');
const DEFAULT_RESPONSES = require('./fixtures/responses.json');

let graphqlResponses = [];
function setGraphqlResponses(responses = DEFAULT_RESPONSES) {
  graphqlResponses = responses.slice();
}

const ghGraphqlApi = {
  // eslint-disable-next-line
  request(query, variables) {
    return new Promise((resolve, reject) => {
      process.nextTick(
        () =>
          graphqlResponses.length
            ? resolve(graphqlResponses.shift())
            : reject(new Error('No response found')),
      );
    });
  },
};

api.ghGraphqlApi = ghGraphqlApi;
api.setGraphqlResponses = setGraphqlResponses;

module.exports = api;
