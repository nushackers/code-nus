jest.mock('write-file-atomic');
jest.mock('./api');

const writeFileAtomic = require('write-file-atomic');
const Scraper = require('./index');

const scraper = new Scraper();

describe('scraper', () => {
  beforeEach(() => {
    // eslint-disable-next-line
    require('./api').setGraphqlResponses();
  });

  it('should scrape from root repos for forks', async () => {
    const results = await scraper._getAllForks();
    expect(results).toHaveLength(3);
  });

  it('should process scaped data cleanly and remove duplicates', async () => {
    const results = await scraper._getAllForks();
    const processed = scraper._processForks(results);
    expect(processed).toHaveLength(2);
    expect(processed).toMatchSnapshot();
  });

  it('should write to file accordingly', async () => {
    await scraper.scrapeAsJson();
    expect(writeFileAtomic).toHaveBeenCalled();
  });
});
