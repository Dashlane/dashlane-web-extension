import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  GetIsLastAdminForItemQuery,
  GetItemGroupIdForItemIdQuery,
  GetPermissionForItemQuery,
  GetPermissionForItemsQuery,
  GetSharedItemsForItemIdsQuery,
  GetSharingStatusForItemQuery,
  GetSharingTeamLoginsQuery,
  GetUserSharedVaultItemsQuery,
  IsSharingAllowedQuery,
  SharedAccessForItemQuery,
  SharedItemsIdsQuery,
  ShareItemsErrorsQuery,
  SharingEnabledQuery,
} from "./queries";
import {
  RefuseSharedItemCommand,
  RemoteControlSharedItemsCommand,
  RevokeSharedItemCommand,
  ShareItemsCommand,
  UpdateSharedItemPermissionCommand,
} from ".";
export const sharingItemsApi = defineModuleApi({
  name: "sharingItems" as const,
  commands: {
    updateSharedItemPermission: UpdateSharedItemPermissionCommand,
    revokeSharedItem: RevokeSharedItemCommand,
    refuseSharedItem: RefuseSharedItemCommand,
    remoteControlSharedItems: RemoteControlSharedItemsCommand,
    shareItems: ShareItemsCommand,
  },
  events: {},
  queries: {
    isSharingAllowed: IsSharingAllowedQuery,
    getSharingTeamLogins: GetSharingTeamLoginsQuery,
    sharingEnabled: SharingEnabledQuery,
    getItemGroupIdForItemId: GetItemGroupIdForItemIdQuery,
    getSharedItemsForItemIds: GetSharedItemsForItemIdsQuery,
    getSharingStatusForItem: GetSharingStatusForItemQuery,
    getPermissionForItem: GetPermissionForItemQuery,
    getPermissionForItems: GetPermissionForItemsQuery,
    getIsLastAdminForItem: GetIsLastAdminForItemQuery,
    sharedAccessForItem: SharedAccessForItemQuery,
    getUserSharedVaultItems: GetUserSharedVaultItemsQuery,
    sharedItemsIds: SharedItemsIdsQuery,
    shareItemsErrors: ShareItemsErrorsQuery,
  },
});
