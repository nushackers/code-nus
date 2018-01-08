const _ = require('lodash');

/**
 * Returns a promise that
 * aggregates data from algolia
 */
function collateAlgoliaIndex(index) {
  const browser = index.browseAll();
  let hits = [];

  browser.on('result', (content) => {
    hits = hits.concat(content.hits);
  });

  return new Promise((resolve, reject) => {
    browser.on('end', () => resolve(hits));
    browser.on('error', (err) => reject(err));
  });
}

// Returns the differences in uploaded content and local
function diffIndexes(index, scrapedContent) {
  return collateAlgoliaIndex(index).then((algoliaContent) =>
    _.differenceWith(scrapedContent, algoliaContent, _.isEqual),
  );
}

/**
 * Returns users with only the following properties
 * objectID,
 * name, login, avatarUrl, languages and repos of nameWithOwner and url
 */
function getUsersOnly(allUsers) {
  return allUsers.map((user) => {
    const repos = user.repositories;
    const languages = _.compact(_.uniqBy(_.map(repos, 'primaryLanguage')));
    return Object.assign({}, user, {
      objectID: user.login, // for algolia
      languages,
      repositories: _.map(repos, (repo) => _.pick(repo, ['nameWithOwner', 'url'])),
    });
  });
}

/**
 * Returns repos with only the following properties
 * objectID,
 * nameWithOwner, descriptionHTML, url, homepageUrl,
 * stargazers, primaryLanguage, repositoryTopics
 */
function getReposOnly(allUsers) {
  const repoMap = {};
  allUsers.forEach(({ repositories }) => {
    repositories.forEach((repo) => {
      const key = repo.nameWithOwner;
      repoMap[key] = Object.assign({}, repo, { objectID: key });
    });
  });
  const repos = Object.values(repoMap);
  return repos;
}

module.exports = {
  getUsersOnly,
  getReposOnly,
  diffIndexes,
};
