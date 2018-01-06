const api = jest.genMockFromModule('../api');
const DEFAULT_RESPONSES = require('./fixtures/responses.json');

let graphqlResponses = [];
function setGraphqlResponses(responses = DEFAULT_RESPONSES) {
  graphqlResponses = responses.slice();
}

const graphqlApi = {
  request(query, variables) {
    return new Promise((resolve, reject) => {
      process.nextTick(
        () =>
          graphqlResponses.length
            ? resolve(graphqlResponses.shift())
            : reject({ error: 'No response found' }),
      );
    });
  },
};

api.graphqlApi = graphqlApi;
api.setGraphqlResponses = setGraphqlResponses;

module.exports = api;
