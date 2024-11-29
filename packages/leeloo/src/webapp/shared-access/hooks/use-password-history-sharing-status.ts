import { useMemo } from "react";
import {
  PasswordHistoryItemType,
  PasswordHistoryItemView,
} from "@dashlane/communication";
import { sharingItemsApi } from "@dashlane/sharing-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
export const usePasswordHistorySharingStatus = (
  passwordHistoryItems: PasswordHistoryItemView[]
) => {
  const sharedItemsPermission = useModuleQuery(
    sharingItemsApi,
    "getPermissionForItems",
    {
      itemIds: passwordHistoryItems.map((item) =>
        item.type === PasswordHistoryItemType.Credential
          ? item.credentialId
          : item.id
      ),
    }
  );
  return useMemo(() => {
    if (sharedItemsPermission.status !== DataStatus.Success) {
      return null;
    }
    return passwordHistoryItems.reduce((acc, item) => {
      if (
        item.type === PasswordHistoryItemType.Credential &&
        !!sharedItemsPermission.data[item.credentialId]
      ) {
        acc[item.id] = {
          isShared: true,
          permission: sharedItemsPermission.data[item.credentialId],
        };
      } else {
        acc[item.id] = {
          isShared: false,
        };
      }
      return acc;
    }, {});
  }, [
    sharedItemsPermission.status,
    sharedItemsPermission.data,
    passwordHistoryItems,
  ]);
};
