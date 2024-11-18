import { CollectionDownload } from "@dashlane/server-sdk/v1";
import { SharingUserGroup, Status } from "@dashlane/sharing-contracts";
import { getHighestPermission } from "../get-highest-permission";
import {
  CollectionAccessData,
  SharedCollectionAccessLinkTypes,
} from "./collection-access-types";
export const checkUserGroupAccess = (
  collection: CollectionDownload,
  myUserGroups: SharingUserGroup[]
): CollectionAccessData | null => {
  const userGroupMembers = collection.userGroups?.filter(
    (userGroup) =>
      myUserGroups.some(
        (userGroupPair) => userGroupPair.groupId === userGroup.uuid
      ) &&
      userGroup.status === Status.Accepted &&
      userGroup.collectionKey
  );
  if (userGroupMembers?.length) {
    const userGroupMember = userGroupMembers[0];
    const resolvedPermission = getHighestPermission(userGroupMembers);
    if (userGroupMember.collectionKey) {
      const { permission, acceptSignature, proposeSignature } = userGroupMember;
      const userGroup = myUserGroups.find(
        (userGroupPair) => userGroupPair.groupId === userGroupMember.uuid
      );
      if (userGroup?.groupKey) {
        const resolvedDecryptionLink = {
          permission,
          acceptSignature,
          proposeSignature,
          encryptedResourceKey: userGroupMember.collectionKey,
          groupEncryptedKey: userGroup.groupKey,
          groupPrivateKey: userGroup.privateKey,
          groupPublicKey: userGroup.publicKey,
          accessType: SharedCollectionAccessLinkTypes.UserGroup,
        };
        return {
          link: resolvedDecryptionLink,
          permission: resolvedPermission,
          isAccepted: true,
        };
      }
    }
  }
  return null;
};
