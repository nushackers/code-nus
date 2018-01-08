import createInstantSearch from 'react-instantsearch/es/src/core/createInstantSearch';
import algoliasearch from 'algoliasearch/lite';

/**
 * Reexport everything from algolia to save bytes on unused widgets
 */

const InstantSearch = createInstantSearch(algoliasearch, {
  Root: 'div',
  props: { className: 'ais-InstantSearch__root' }
});

export { InstantSearch };
export { default as SearchBox } from 'react-instantsearch/es/src/widgets/SearchBox';
export { default as InfiniteHits } from 'react-instantsearch/es/src/widgets/InfiniteHits';
export { default as PoweredBy } from 'react-instantsearch/es/src/widgets/PoweredBy';
export { default as Panel } from 'react-instantsearch/es/src/widgets/Panel';
export { default as RefinementList } from 'react-instantsearch/es/src/widgets/RefinementList';
