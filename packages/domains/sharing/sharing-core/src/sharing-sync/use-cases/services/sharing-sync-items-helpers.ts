import {
  Credential,
  isCredential,
  isNote,
  Note,
  Secret,
} from "@dashlane/communication";
import { ItemGroupDownload } from "@dashlane/server-sdk/v1";
import {
  PendingSharedItemInvite,
  Permission,
  ShareableItemType,
  SharedItem,
  SharedItemAccessLinkTypes,
  SharedItemDecryptionLink,
  Status,
} from "@dashlane/sharing-contracts";
export interface PendingInviteWithoutContent {
  referrer: string;
  permission: Permission;
  sharedItemId: string;
  vaultItemId: string;
}
export const getPublicKey = (accessLink: SharedItemDecryptionLink) => {
  switch (accessLink.accessType) {
    case SharedItemAccessLinkTypes.UserGroup:
      return accessLink.groupPublicKey;
    case SharedItemAccessLinkTypes.CollectionUserGroup:
    case SharedItemAccessLinkTypes.CollectionUser:
      return accessLink.collectionPublicKey;
    default:
      break;
  }
};
export const convertSharedItemToInvite = (
  sharedItem: SharedItem,
  item: Credential | Note | Secret,
  pendingAccess: PendingInviteWithoutContent,
  timestamp: number
): PendingSharedItemInvite => {
  const base = {
    vaultItemId: sharedItem.itemId,
    title: item.Title,
    spaceId: item.SpaceId,
    referrer: pendingAccess.referrer,
    sharedItemId: sharedItem.sharedItemId,
    permission: pendingAccess.permission,
    revision: timestamp,
  };
  if (isCredential(item)) {
    return {
      ...base,
      itemType: ShareableItemType.Credential,
      url: item.Url,
      linkedDomains: item.LinkedServices?.associated_domains.map(
        (domains) => domains.domain
      ),
      email: item.Email,
      login: item.Login,
      secondaryLogin: item.SecondaryLogin,
    };
  } else if (isNote(item)) {
    return {
      ...base,
      itemType: ShareableItemType.SecureNote,
      color: item.Type,
      secured: item.Secured,
    };
  } else {
    return {
      ...base,
      itemType: ShareableItemType.Secret,
      secured: item.Secured,
    };
  }
};
export const isLastActiveUserInItemGroupAndAdmin = (
  itemGroup: ItemGroupDownload,
  userId: string
): boolean => {
  const collections = itemGroup.collections;
  if (collections && collections.length > 0) {
    return false;
  }
  const { users, groups } = itemGroup;
  const noGroups =
    !groups ||
    groups.filter(
      (group) =>
        group.status === Status.Accepted || group.status === Status.Pending
    ).length === 0;
  const onlyUserAndAdmin =
    users &&
    users.filter(
      (user) =>
        user.status === Status.Accepted || user.status === Status.Pending
    ).length === 1 &&
    users[0].userId === userId &&
    users[0].status === Status.Accepted &&
    users[0].permission === Permission.Admin;
  return noGroups && !!onlyUserAndAdmin;
};
