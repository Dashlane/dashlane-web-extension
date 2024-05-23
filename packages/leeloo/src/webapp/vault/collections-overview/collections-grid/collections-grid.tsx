import React, { Fragment, memo, useState } from 'react';
import { InfiniteScrollList } from 'webapp/vault/pagination/infinite-scroll-list';
import { useCollectionsContext } from 'webapp/vault/collections-context';
import { useCollectionsOverviewContext } from '../collections-overview-context';
import { GridList } from './layout/grid-list';
import { CollectionArticle } from './collection-article';
import { GridHeader } from './grid-header';
const PAGE_SIZE = 50;
const normalizeString = (str: string) => str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
export const CollectionsGrid = memo(() => {
    const { allCollections } = useCollectionsContext();
    const { searchValue } = useCollectionsOverviewContext();
    const [pageNumber, setPageNumber] = useState(1);
    const onNextPage = (nextPageNumber: number) => {
        if (PAGE_SIZE * (nextPageNumber - 1) <= allCollections.length) {
            setPageNumber(nextPageNumber);
        }
    };
    return (<>
      <GridHeader />
      <InfiniteScrollList onNextPage={onNextPage} hasMore={true} ListComponent={GridList}>
        {allCollections
            .filter((collection) => collection.name
            .toLowerCase()
            .includes(normalizeString(searchValue)))
            .slice(0, PAGE_SIZE * pageNumber)
            .map((collection) => (<li key={`collections_overview_${collection.name}_${collection.id}`}>
              <CollectionArticle collection={collection}/>
            </li>))}
      </InfiniteScrollList>
    </>);
});
CollectionsGrid.displayName = 'CollectionsGrid';
