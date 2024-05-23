import React, { ComponentType, useRef, useState } from 'react';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { ItemsQueryResult, VaultItem, vaultItemsCrudApi, VaultItemType, VaultItemTypeToResultDictionary, } from '@dashlane/vault-contracts';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { InfiniteScrollList } from './infinite-scroll-list';
interface Props<T extends VaultItem> {
    vaultItemType: VaultItemType;
    renderItem: (item: T) => JSX.Element;
    EmptyViewComponent?: ComponentType;
    LoadingComponent?: ComponentType;
    sortingProperty?: string;
}
const PAGE_SIZE = 20;
export const PaginatedVaultItemsList = <T extends VaultItem>({ vaultItemType, renderItem, EmptyViewComponent, LoadingComponent, sortingProperty = 'itemName', }: Props<T>) => {
    const itemsResultRef = useRef<ItemsQueryResult<T>>({
        items: [],
        matchCount: 0,
    });
    const [pageNumber, setPageNumber] = useState(1);
    const { currentSpaceId } = useTeamSpaceContext();
    const { status, data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [vaultItemType],
        propertyFilters: currentSpaceId !== null
            ? [
                {
                    property: 'spaceId',
                    value: currentSpaceId,
                },
            ]
            : undefined,
        propertySorting: {
            property: sortingProperty,
        },
        pageNumber: 1,
        pageSize: PAGE_SIZE * pageNumber,
    });
    if (LoadingComponent &&
        status === DataStatus.Loading &&
        !itemsResultRef.current.items.length) {
        return <LoadingComponent />;
    }
    if (data) {
        itemsResultRef.current =
            data[VaultItemTypeToResultDictionary[vaultItemType]];
    }
    const { items, matchCount } = itemsResultRef.current;
    if (EmptyViewComponent && !items.length) {
        return <EmptyViewComponent />;
    }
    return (<InfiniteScrollList onNextPage={(nextPageNumber) => {
            setPageNumber(nextPageNumber);
        }} hasMore={items.length < matchCount}>
      {items.map(renderItem)}
    </InfiniteScrollList>);
};
