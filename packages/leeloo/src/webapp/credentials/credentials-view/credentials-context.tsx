import React, { createContext, ReactNode, useContext, useState } from 'react';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { Credential, SortDirection, vaultItemsCrudApi, VaultItemType, } from '@dashlane/vault-contracts';
import { OrderDir } from 'libs/sortHelper';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { SortingOptions } from 'webapp/list-view/types';
import { useSortingOptions } from './use-sorting-options';
interface Context {
    credentials: Credential[];
    hasMore: boolean;
    onNextPage: (nextPageNumber: number) => void;
    setSortOrder: (newSortingOptions: SortingOptions) => void;
    sortingOptions: SortingOptions;
    status: DataStatus;
}
const CredentialsContext = createContext<Context>({} as Context);
interface Provider {
    children: ReactNode;
    ids?: string[];
}
const PAGE_SIZE = 20;
const CredentialsProvider = ({ children, ids }: Provider) => {
    const { currentSpaceId } = useTeamSpaceContext();
    const { setSortOrder, sortingOptions } = useSortingOptions();
    const [pageNumber, setPageNumber] = useState(1);
    const { data, status } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Credential],
        pageNumber: 1,
        pageSize: PAGE_SIZE * pageNumber,
        ids: ids,
        propertyFilters: currentSpaceId !== null
            ? [
                {
                    property: 'spaceId',
                    value: currentSpaceId,
                },
            ]
            : undefined,
        propertySorting: {
            property: sortingOptions.field === 'title' ? 'itemName' : sortingOptions.field,
            direction: sortingOptions.direction === OrderDir.ascending
                ? SortDirection.Ascend
                : SortDirection.Descend,
        },
    });
    const contextValue = {
        credentials: data?.credentialsResult.items ?? [],
        hasMore: !data ||
            data.credentialsResult.items.length < data.credentialsResult.matchCount,
        onNextPage: setPageNumber,
        setSortOrder,
        sortingOptions,
        status,
    };
    return (<CredentialsContext.Provider value={contextValue}>
      {children}
    </CredentialsContext.Provider>);
};
const useCredentialsContext = () => useContext(CredentialsContext);
export { CredentialsProvider, useCredentialsContext };
