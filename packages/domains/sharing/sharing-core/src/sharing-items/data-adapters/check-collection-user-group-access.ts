import { UserGroupDownload } from "@dashlane/server-sdk/v1";
import { ItemGroup } from "../../sharing-common";
import {
  SharedCollection,
  SharedItemAccessLinkTypes,
  Status,
} from "@dashlane/sharing-contracts";
import { AccessData } from "./item-group-adapter.types";
import { getHighestPermission } from "../../utils/get-highest-permission";
import { filterCollectionMembers } from "./filter-collection-members";
export const checkCollectionUserGroupAccess = (
  itemGroup: ItemGroup,
  login: string,
  myUserGroups: UserGroupDownload[],
  allCollections: SharedCollection[]
): AccessData | null => {
  const myCollectionsViaUserGroup = allCollections.filter((collection) =>
    collection.userGroups?.some(
      (userGroup) =>
        myUserGroups.some(
          (myUserGroup) => myUserGroup.groupId === userGroup.uuid
        ) &&
        userGroup.status === Status.Accepted &&
        userGroup.collectionKey
    )
  );
  const collectionUserGroupMembers = filterCollectionMembers(
    itemGroup.collections,
    myCollectionsViaUserGroup
  );
  if (collectionUserGroupMembers?.length) {
    const collectionUserGroupMember = collectionUserGroupMembers[0];
    const resolvedPermission = getHighestPermission(collectionUserGroupMembers);
    if (collectionUserGroupMember.itemGroupKey) {
      const { permission, acceptSignature, proposeSignature } =
        collectionUserGroupMember;
      const collection = myCollectionsViaUserGroup.find(
        (coll) => coll.uuid === collectionUserGroupMember.uuid
      );
      const userGroupInCollection = collection?.userGroups?.find((group) =>
        myUserGroups.some((myUserGroup) => myUserGroup.groupId === group.uuid)
      );
      if (!userGroupInCollection) {
        return null;
      }
      const userGroup = myUserGroups.find(
        ({ groupId }) => groupId === userGroupInCollection.uuid
      );
      const userMemberOfUserGroup = userGroup?.users.find(
        ({ userId }) => userId === login
      );
      if (
        userGroupInCollection.collectionKey &&
        collection &&
        userMemberOfUserGroup?.groupKey
      ) {
        const resolvedDecryptionLink = {
          permission,
          acceptSignature,
          proposeSignature,
          encryptedResourceKey: collectionUserGroupMember.itemGroupKey,
          collectionEncryptedKey: userGroupInCollection.collectionKey,
          collectionPrivateKey: collection.privateKey,
          groupPrivateKey: userGroup?.privateKey,
          groupEncryptedKey: userMemberOfUserGroup.groupKey,
          accessType: SharedItemAccessLinkTypes.CollectionUserGroup,
        };
        return {
          link: resolvedDecryptionLink,
          permission: resolvedPermission,
        };
      }
    }
  }
  return null;
};
