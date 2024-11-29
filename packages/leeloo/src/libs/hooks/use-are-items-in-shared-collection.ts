import { sharingCollectionsApi } from "@dashlane/sharing-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
export const useGetItemIdsInSharedCollections = (itemIds: string[]) => {
  return useModuleQuery(
    sharingCollectionsApi,
    "getItemIdsInSharedCollections",
    {
      itemIds,
    }
  );
};
export const useGetItemIdsInSharedCollectionsData = (itemIds: string[]) => {
  const result = useGetItemIdsInSharedCollections(itemIds);
  return result.status === DataStatus.Success ? result.data : [];
};
