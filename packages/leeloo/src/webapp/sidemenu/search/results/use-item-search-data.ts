import { useState } from "react";
import { useModuleQuery } from "@dashlane/framework-react";
import {
  Collection,
  ItemsQueryResult,
  VaultItem,
  VaultItemType,
  VaultItemTypeToResultDictionary,
  vaultSearchApi,
  VaultSearchRankedQueryResult,
} from "@dashlane/vault-contracts";
const INITIAL_LIMIT = 10;
const LIMIT_INCREMENT = 10;
interface UseItemSearchRankedDataReturn {
  result?: ItemsQueryResult<VaultItem | Collection>;
  loadMore: () => void;
}
interface UseItemSearchDataReturn<T extends VaultItem> {
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
export const useItemSearchRankedData = (
  searchQuery: string
): UseItemSearchRankedDataReturn => {
  const { limit, loadMore } = useLimit();
  const { data } = useModuleQuery(vaultSearchApi, "vaultSearchRanked", {
    searchQuery: searchQuery,
    pageSize: limit,
    pageNumber: 1,
    vaultItemTypes: undefined,
  });
  return {
    result: data as VaultSearchRankedQueryResult,
    loadMore,
  };
};
export const useItemSearchData = <T extends VaultItem>(
  searchQuery: string,
  vaultItemType: VaultItemType
): UseItemSearchDataReturn<T> => {
  const { limit, loadMore } = useLimit();
  const { data } = useModuleQuery(vaultSearchApi, "search", {
    searchQuery: searchQuery,
    vaultItemTypes: [vaultItemType],
    pageSize: limit,
    pageNumber: 1,
  });
  return {
    result: data?.[
      VaultItemTypeToResultDictionary[vaultItemType]
    ] as ItemsQueryResult<T>,
    loadMore,
  };
};
