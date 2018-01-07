jest.mock('write-file-atomic');
jest.mock('./api');

const writeFileAtomic = require('write-file-atomic');
const Scraper = require('./scraper');

const scraper = new Scraper();

describe('scraper', () => {
  beforeEach(() => {
    // eslint-disable-next-line
    require('./api').setGraphqlResponses();
  });

  it('should scrape from root repos for forks', async () => {
    const results = await scraper.getAllForks();
    expect(results).toHaveLength(3);
  });

  it('should process scaped data cleanly and remove duplicates', async () => {
    const results = await scraper.getAllForks();
    const processed = Scraper.processForks(results);
    expect(processed).toHaveLength(2);
    // stringify then parse to get rid of undefined values
    expect(JSON.parse(JSON.stringify(processed, null, 2))).toMatchSnapshot();
  });

  it('should write to file accordingly', async () => {
    await scraper.scrapeAsJson();
    expect(writeFileAtomic).toHaveBeenCalled();
  });
});
