import { h } from 'preact';
import {
  InstantSearch,
  SearchBox,
  InfiniteHits,
  Panel,
  RefinementList,
  PoweredBy,
} from 'react-instantsearch/dom';
import Card from './card';

import style from './style.scss';

export default function Projects() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = process.env;
  return (
    <InstantSearch
      appId={ALGOLIA_APP_ID}
      apiKey={ALGOLIA_SEARCH_API_KEY}
      indexName="code@nus_projects"
      root={{
        Root: 'div',
        props: {
          className: `container-fluid ${style.projects}`,
        },
      }}
    >
      <section className={`${style.searchContainer}`}>
        <div className={`card-static ${style.search}`}>
          <SearchBox />
          <PoweredBy />
          <Panel title="Languages">
            <RefinementList attributeName="primaryLanguage" limitMin={7} showMore />
          </Panel>
        </div>
      </section>
      <section className={style.hits}>
        <InfiniteHits hitComponent={Card} />
      </section>
    </InstantSearch>
  );
}
