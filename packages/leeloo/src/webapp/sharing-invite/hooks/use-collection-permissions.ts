import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  CollectionPermissions,
  SharedCollectionRole,
  sharingCollectionsApi,
} from "@dashlane/sharing-contracts";
export const useCollectionRoleForGroup = (
  collectionId: string,
  groupId?: string
): SharedCollectionRole => {
  const result = useModuleQuery(
    sharingCollectionsApi,
    "getCollectionRoleForGroup",
    {
      collectionId,
      groupId,
    }
  );
  return result.status === DataStatus.Success
    ? result.data
    : SharedCollectionRole.Editor;
};
export const useCollectionPermissionsForUser = (
  collectionId: string,
  userId?: string
): CollectionPermissions => {
  const result = useModuleQuery(
    sharingCollectionsApi,
    "getCollectionPermissionsForUser",
    {
      collectionId,
      userId,
    }
  );
  return result.status === DataStatus.Success
    ? result.data
    : {
        role: SharedCollectionRole.Editor,
        canShare: false,
        canEditRoles: false,
        canEdit: false,
        canDelete: false,
      };
};
