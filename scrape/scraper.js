const _ = require('lodash');
const writeFileAtomic = require('write-file-atomic');
const { ghGraphqlApi } = require('./api');

// Minimum in kb
const MIN_REPO_SIZE = 10;

const query = `
  query($owner: String!, $name: String!, $pageCursor: String) {
    repository(owner: $owner, name: $name) {
      forks(first: 10, before: $pageCursor) {
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
              repositoriesContributedTo(
                first: 5
                isLocked: false
                includeUserRepositories: true
                orderBy: { field: STARGAZERS, direction: DESC }
                contributionTypes: [COMMIT]
              ) {
                nodes {
                  nameWithOwner
                  descriptionHTML
                  url
                  homepageUrl
                  diskUsage
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
        return ghGraphqlApi.request(query, variables).then(pager);
      }
      return forks;
    };
    return ghGraphqlApi.request(query, this.options).then(pager);
  }

  /**
   * Remaps data to a unnested state
   * @param {*} forks
   */
  static processForks(forks) {
    const allUsers = _.flatMap(forks, (fork) => fork.assignableUsers.nodes);
    const userMap = {};
    allUsers.forEach((node) => {
      const meaningfulRepos = node.repositoriesContributedTo.nodes
        .filter((repo) => repo.diskUsage && repo.diskUsage > MIN_REPO_SIZE)
        .map((repo) =>
          Object.assign({}, repo, {
            primaryLanguage: _.get(repo, ['primaryLanguage', 'name'], undefined),
            stargazers: repo.stargazers.totalCount,
            repositoryTopics: repo.repositoryTopics.nodes.map((topicNode) => topicNode.topic.name),
          }),
        );

      // exclude users with no repos
      if (!meaningfulRepos.length) {
        return;
      }

      userMap[node.login] = {
        name: node.name,
        login: node.login,
        avatarUrl: node.avatarUrl,
        repositories: meaningfulRepos,
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
