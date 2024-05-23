import React from 'react';
import { useCollectionsContext } from 'webapp/vault/collections-context';
import { CollectionsOverviewProvider } from './collections-overview-context';
import { CollectionsOverviewHeader } from './collections-overview-header';
import { CollectionsGrid } from './collections-grid';
import { CollectionsSearch } from './collections-search';
import { CollectionsOverviewPaywall } from './collections-overview-paywall';
import { CollectionsOverviewCreate } from './collections-overview-create';
export const CollectionsOverview = () => {
    const { allCollections } = useCollectionsContext();
    const hasCollections = allCollections.length > 0;
    return (<>
      <CollectionsOverviewHeader />
      <CollectionsOverviewProvider>
        <CollectionsOverviewPaywall />
        {hasCollections ? (<>
            <CollectionsSearch />
            <CollectionsGrid />
          </>) : (<CollectionsOverviewCreate />)}
      </CollectionsOverviewProvider>
    </>);
};
