import { useState } from 'react';
import { useModuleQuery } from '@dashlane/framework-react';
import { ItemsQueryResult, VaultItem, VaultItemType, VaultItemTypeToResultDictionary, vaultSearchApi, } from '@dashlane/vault-contracts';
const INITIAL_LIMIT = 5;
const LIMIT_INCREMENT = 5;
interface UseItemSearchDataReturn<T> {
    result?: ItemsQueryResult<T>;
    loadMore: () => void;
}
const useLimit = () => {
    const [limit, setLimit] = useState(INITIAL_LIMIT);
    const loadMore = () => setLimit((current) => current + LIMIT_INCREMENT);
    return {
        limit,
        loadMore,
    };
};
export const useItemSearchData = <T extends VaultItem>(searchQuery: string, vaultItemType: VaultItemType): UseItemSearchDataReturn<T> => {
    const { limit, loadMore } = useLimit();
    const { data } = useModuleQuery(vaultSearchApi, 'search', {
        searchQuery: searchQuery,
        vaultItemTypes: [vaultItemType],
        pageSize: limit,
        pageNumber: 1,
    });
    return {
        result: data?.[VaultItemTypeToResultDictionary[vaultItemType]],
        loadMore,
    };
};
