import { SharingData } from "@dashlane/communication";
import {
  CollectionDownload,
  getSharedItemGroupsById,
  ItemGroupDownload,
} from "./collection-helpers";
export const getLimitedSharedItemIds = (
  sharingData: SharingData,
  sharingDataCollections: CollectionDownload[] | undefined,
  sharingDataItemsWithCollections: ItemGroupDownload[],
  userId: string
): {
  [id: string]: boolean;
} => {
  const myGroups = sharingData.userGroups.filter((group) =>
    group.users.some(
      (userMember) =>
        userMember.userId === userId && userMember.status === "accepted"
    )
  );
  const myGroupIds = new Set(myGroups.map((group) => group.groupId));
  const collections = sharingDataCollections ?? [];
  const itemGroupsWithCollectionsById = getSharedItemGroupsById(
    sharingDataItemsWithCollections
  );
  const myCollections = collections.filter(
    (collection) =>
      (collection.users ?? []).some(
        (userMember) =>
          userMember.login === userId && userMember.status === "accepted"
      ) ||
      (collection.userGroups ?? []).some(
        (groupMember) =>
          myGroupIds.has(groupMember.uuid) && groupMember.status === "accepted"
      )
  );
  const myCollectionIds = new Set(
    myCollections.map((collection) => collection.uuid)
  );
  const itemGroups = sharingData.itemGroups.filter((itemGroup) => {
    const sharedWithAdminRightsToMe = itemGroup.users?.some(
      (user) =>
        user.userId === userId &&
        user.permission === "admin" &&
        user.status === "accepted"
    );
    const sharedWithAdminRightsToMyGroup = itemGroup.groups?.some(
      (userGroupMember) =>
        myGroupIds.has(userGroupMember.groupId) &&
        userGroupMember.permission === "admin" &&
        userGroupMember.status === "accepted"
    );
    const sharedWithAdminRightsToMyCollection = itemGroupsWithCollectionsById[
      itemGroup.groupId
    ]?.collections?.some(
      (collectionMember) =>
        myCollectionIds.has(collectionMember.uuid) &&
        collectionMember.permission === "admin" &&
        collectionMember.status === "accepted"
    );
    return !(
      sharedWithAdminRightsToMe ||
      sharedWithAdminRightsToMyGroup ||
      sharedWithAdminRightsToMyCollection
    );
  });
  return itemGroups
    .map((itemGroup) => (itemGroup.items || []).map((item) => item.itemId))
    .reduce((acc, itemIds) => acc.concat(itemIds), [])
    .reduce((acc, itemId) => ({ ...acc, [itemId]: true }), {});
};
