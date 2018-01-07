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
              name
              login
              avatarUrl
              repositories(
                first: 5
                isFork: false
                orderBy: { field: STARGAZERS, direction: DESC }
                affiliations: [OWNER, ORGANIZATION_MEMBER]
              ) {
                nodes {
                  nameWithOwner
                  descriptionHTML
                  url
                  homepageUrl
                  stargazers {
                    totalCount
                  }
                  primaryLanguage {
                    name
                  }
                  repositoryTopics(first: 3) {
                    nodes {
                      topic {
                        name
                      }
                    }
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
  async getAllForks() {
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
  static processForks(forks) {
    const allUsers = _.flatMap(forks, (fork) => fork.assignableUsers.nodes);
    const userMap = {};
    allUsers.forEach((node) => {
      userMap[node.login] = {
        name: node.name,
        login: node.login,
        avatarUrl: node.avatarUrl,
        repositories: node.repositories.nodes.map((repo) =>
          Object.assign({}, repo, {
            primaryLanguage: repo.primaryLanguage.name,
            stargazers: repo.stargazers.totalCount,
            repositoryTopics: repo.repositoryTopics.nodes.map((topicNode) => topicNode.topic.name),
          }),
        ),
      };
    });
    return Object.values(userMap);
  }

  async collect() {
    const nodes = await this.getAllForks();
    return Scraper.processForks(nodes);
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
