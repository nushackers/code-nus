const _ = require('lodash');
const writeFileAtomic = require('write-file-atomic');
const { graphqlApi } = require('./api');

const query = `
  query($owner: String!, $name: String!, $pageCursor: String) {
    repository(owner: $owner, name: $name) {
      forks(first: 100, before: $pageCursor) {
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          assignableUsers(first: 5) {
            nodes {
              id
              repositories(
                first: 5
                isFork: false
                orderBy: { field: STARGAZERS, direction: DESC }
              ) {
                nodes {
                  nameWithOwner
                  url
                  description
                  stargazers {
                    totalCount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const DEFAULT_OPTIONS = { owner: 'se-edu', name: 'addressbook-level4' };
class Scraper {
  constructor(options = DEFAULT_OPTIONS) {
    this.options = options;
  }

  /**
   * Recursively scrapes for all forks' users.
   *
   * returns an array of nodes right under forks layer
   */
  async _getAllForks() {
    let forks = [];

    const pager = (response) => {
      const { pageInfo, nodes } = response.repository.forks;

      if (nodes) {
        forks = forks.concat(nodes);
      }

      if (pageInfo.hasNextPage) {
        const variables = Object.assign({}, this.options, {
          pageCursor: pageInfo.endCursor,
        });
        return graphqlApi.request(query, variables).then(pager);
      }
      return forks;
    };
    return graphqlApi.request(query, this.options).then(pager);
  }

  /**
   * Remaps data to a unnested state
   * @param {*} forks
   */
  static _processForks(forks) {
    const allUsers = _.flatMap(forks, (fork) => fork.assignableUsers.nodes);
    const users = allUsers.map((node) => ({
      userId: node.id,
      repositories: node.repositories.nodes.map((repo) =>
        Object.assign({}, repo, {
          stargazers: repo.stargazers.totalCount,
        }),
      ),
    }));
    return _.uniqBy(users, 'userId');
  }

  async collect() {
    const nodes = await this._getAllForks();
    return this._processForks(nodes);
  }

  async scrapeAsJson() {
    const processedNodes = await this.collect();
    const json = JSON.stringify(processedNodes, null, 2);

    const { owner, name } = this.options;
    writeFileAtomic(`data/${name}-${owner}-users.json`, json, (err) => {
      if (err) return Promise.reject(err);
      return Promise.resolve();
    });
  }
}

module.exports = Scraper;
