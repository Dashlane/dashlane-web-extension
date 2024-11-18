import { isCredential, isNote } from "@dashlane/communication";
import {
  PendingCollection,
  PendingItemGroup,
  PendingSharedItemInvite,
  PendingUserGroup,
  Permission,
  ShareableItemType,
  SharedCollection,
  Status,
} from "@dashlane/sharing-contracts";
const isValidPendingCollection = (
  partialPendingCollection: Partial<PendingCollection>
): partialPendingCollection is PendingCollection =>
  partialPendingCollection.referrer !== undefined &&
  partialPendingCollection.permission !== undefined;
export const getPendingCollectionsQueryObjects = (
  pendingCollections: SharedCollection[],
  currentUserLogin: string
): PendingCollection[] =>
  pendingCollections
    .map((collectionDownload) => {
      const collectionInvite = (collectionDownload.users || []).find(
        (userMember) =>
          userMember.login === currentUserLogin &&
          userMember.status === Status.Pending
      );
      return {
        uuid: collectionDownload.uuid,
        name: collectionDownload.name,
        referrer: collectionInvite?.referrer,
        permission: collectionInvite?.permission,
      };
    })
    .filter(isValidPendingCollection);
const convertPermission = (
  group: PendingItemGroup | PendingUserGroup | PendingCollection
) => (group.permission === "admin" ? Permission.Admin : Permission.Limited);
export const convertLegacyPendingItemGroup = (
  group: PendingItemGroup
): PendingSharedItemInvite => {
  const base = {
    vaultItemId: group.items[0].Id,
    title: group.items[0].Title,
    spaceId: group.items[0].SpaceId,
    referrer: group.referrer,
    sharedItemId: group.itemGroupId,
    permission: convertPermission(group),
    revision: 0,
  };
  const item = group.items[0];
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
export const convertLegacyPendingUserGroup = (group: PendingUserGroup) => ({
  id: group.groupId,
  name: group.name,
  referrer: group.referrer,
  permission: convertPermission(group),
});
export const convertLegacyPendingCollection = (
  collection: PendingCollection
) => ({
  id: collection.uuid,
  name: collection.name,
  referrer: collection.referrer,
  permission: convertPermission(collection),
});
