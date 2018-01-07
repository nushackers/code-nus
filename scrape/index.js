require('dotenv').config();

const writeFileAtomic = require('write-file-atomic');
const Scraper = require('./scraper');

const repoOptions = [
  undefined,
  { owner: 'nus-cs2103-AY1617S1', name: 'addressbook-level4' },
  { owner: 'nus-cs2103-AY1617S2', name: 'addressbook-level4' },

  { owner: 'nus-cs2103-AY1718S1', name: 'addressbook-level4' },
  { owner: 'nus-cs2103-AY1718S2', name: 'addressbook-level4' },
];

async function processAllData() {
  const userMap = {};
  for (const repoOption of repoOptions) {
    // "throttle" calls so github don't 304 us
    // eslint-disable-next-line  no-await-in-loop
    const contents = await new Scraper(repoOption).collect();
    contents.forEach((user) => {
      userMap[user.userId] = user;
    });
  }
  const uniqueUsers = Object.values(userMap);

  const json = JSON.stringify(uniqueUsers, null, 2);
  writeFileAtomic(`data/users.json`, json, (err) => {
    if (err) return Promise.reject(err);
    return Promise.resolve();
  });
}

processAllData()
  .then(() => {
    console.log('success!'); // eslint-disable-line
  })
  .catch((error) => {
    throw error;
  });
