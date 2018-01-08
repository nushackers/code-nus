import { h } from 'preact';
import { InstantSearch, SearchBox, InfiniteHits, PoweredBy } from 'react-instantsearch/dom';
import Card from './card';

import style from './style.scss';

export default function Users() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = process.env;
  return (
    <InstantSearch
      appId={ALGOLIA_APP_ID}
      apiKey={ALGOLIA_SEARCH_API_KEY}
      indexName="code@nus_users"
      root={{
        Root: 'div',
        props: {
          className: `container ${style.users}`,
        },
      }}
    >
      <SearchBox />
      <PoweredBy />
      <InfiniteHits hitComponent={Card} />
    </InstantSearch>
  );
}
