import {
  ItemGroupDownload,
  UserDownload,
  UserGroupDownload,
  UserGroupMemberDownload,
} from "@dashlane/sharing/types/serverResponse";
import { ItemGroupDownload as NewItemGroupDownload } from "@dashlane/server-sdk/v1";
import { CollectionDownload } from "./collection-helpers";
import {
  findMyItemGroupCollectionMemberAsUser,
  findMyItemGroupCollectionMemberViaUserGroup,
} from "./SharingHelpers";
import { TypeOfArray } from "./utils";
export function findMyAcceptedItemGroupUserGroupMembers(
  itemGroup: NewItemGroupDownload,
  userGroups: UserGroupDownload[],
  userId: string
): UserGroupMemberDownload[] {
  const amIPartOfUserGroup = (userGroup: UserGroupDownload): boolean =>
    (userGroup.users || []).map((u: UserDownload) => u.userId).includes(userId);
  const userGroupsImPartOf = (userGroups || []).filter(amIPartOfUserGroup);
  const userGroupIdsImPartOf = userGroupsImPartOf.map(
    (g: UserGroupDownload) => g.groupId
  );
  return (itemGroup.groups || []).filter(
    (g) => userGroupIdsImPartOf.includes(g.groupId) && g.status === "accepted"
  );
}
export function findMyAcceptedItemGroupCollectionMembers(
  itemGroup: NewItemGroupDownload,
  collections: CollectionDownload[],
  userGroups: UserGroupDownload[],
  login: string
): TypeOfArray<NewItemGroupDownload["collections"]>[] {
  const collectionMember = findMyItemGroupCollectionMemberAsUser(
    itemGroup,
    login,
    collections
  );
  const collectionUserGroupMember = findMyItemGroupCollectionMemberViaUserGroup(
    itemGroup,
    userGroups,
    login,
    collections
  )?.member;
  return (itemGroup.collections || []).filter((collection) => {
    const isSharedWithUser = collectionMember?.uuid === collection.uuid;
    const isSharedWithGroup =
      collectionUserGroupMember?.uuid === collection.uuid;
    return (
      collection.status === "accepted" &&
      (isSharedWithUser || isSharedWithGroup)
    );
  });
}
export function findMyAcceptedItemGroups(
  itemGroups: ItemGroupDownload[],
  userGroups: UserGroupDownload[],
  collections: CollectionDownload[],
  login: string
): ItemGroupDownload[] {
  return itemGroups.filter((itemGroup) => {
    const newItemGroup = itemGroup as NewItemGroupDownload;
    const correctType = itemGroup.type === "items";
    const isDirectlyShared = (itemGroup.users || []).some(
      (user) => user.userId === login && user.status === "accepted"
    );
    const acceptedGroupMembers = findMyAcceptedItemGroupUserGroupMembers(
      newItemGroup,
      userGroups,
      login
    );
    const isSharedToGroup = acceptedGroupMembers.length > 0;
    const acceptedCollectionMembers = findMyAcceptedItemGroupCollectionMembers(
      newItemGroup,
      collections,
      userGroups,
      login
    );
    const isSharedViaCollection = acceptedCollectionMembers.length > 0;
    return (
      correctType &&
      (isDirectlyShared || isSharedToGroup || isSharedViaCollection)
    );
  });
}
export function findItemItemGroup(
  itemId: string,
  itemGroups: ItemGroupDownload[]
): ItemGroupDownload | undefined {
  return itemGroups.find((itemGroup: ItemGroupDownload) =>
    (itemGroup.items || []).map((i) => i.itemId).includes(itemId)
  );
}
export function getItemGroupActiveUsers(
  itemGroup: ItemGroupDownload
): UserDownload[] {
  return (itemGroup.users || []).filter(memberIsActive);
}
const memberIsActive = (
  member: UserGroupMemberDownload | UserDownload
): boolean => ["accepted", "pending"].includes(member.status);
