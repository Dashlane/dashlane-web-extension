import { sharingCollectionsApi } from "@dashlane/sharing-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
export const useSharedCollections = (collectionIds?: string[]) => {
  return useModuleQuery(sharingCollectionsApi, "getSharedCollections", {
    collectionIds,
  });
};
export const useSharedCollectionsData = (collectionIds?: string[]) => {
  const result = useSharedCollections(collectionIds);
  return result.status === DataStatus.Success ? result.data : [];
};
export const useSharedCollectionsCount = () => {
  return useModuleQuery(sharingCollectionsApi, "getSharedCollectionsCount");
};
