require('dotenv').config();

const writeFileAtomic = require('write-file-atomic');
const Scraper = require('./scraper');
const { algoliaProjectsIndex, algoliaUsersIndex } = require('./api');
const { getUsersOnly, getReposOnly, diffIndexes } = require('./aggregate');

const repoOptions = [
  undefined,
  { owner: 'nus-cs2103-AY1617S1', name: 'addressbook-level4' },
  { owner: 'nus-cs2103-AY1617S2', name: 'addressbook-level4' },

  { owner: 'nus-cs2103-AY1718S1', name: 'addressbook-level4' },
  { owner: 'nus-cs2103-AY1718S2', name: 'addressbook-level4' },

  { owner: 'nus-cs2103-AY1819S1', name: 'addressbook-level4' },
  // { owner: 'nus-cs2103-AY1819S2', name: 'addressbook-level4' },
];

async function processAllData() {
  const userMap = {};
  for (const repoOption of repoOptions) {
    // "throttle" calls so github don't 429 us
    // eslint-disable-next-line  no-await-in-loop
    const contents = await new Scraper(repoOption).collect();
    contents.forEach((user) => {
      userMap[user.login] = user;
    });
  }
  const uniqueUsers = Object.values(userMap);

  const json = JSON.stringify(uniqueUsers, null, 2);

  return new Promise((resolve, reject) => {
    writeFileAtomic(`data/users.json`, json, (err) => {
      if (err) return reject(err);
      return resolve(uniqueUsers);
    });
  });
}

async function uploadToAlgolia() {
  const data = await processAllData();
  console.log('Scraped successfully! Uploading data to algolia...'); // eslint-disable-line

  const users = getUsersOnly(data);
  const changedUsers = await diffIndexes(algoliaUsersIndex, users);
  algoliaUsersIndex.saveObjects(changedUsers, (err) => {
    if (err) throw err;
  });

  const repos = getReposOnly(data);
  const changedRepos = await diffIndexes(algoliaProjectsIndex, repos);
  algoliaProjectsIndex.saveObjects(changedRepos, (err) => {
    if (err) throw err;
  });
}

try {
  uploadToAlgolia();
} catch (err) {
  console.error(err);
}
