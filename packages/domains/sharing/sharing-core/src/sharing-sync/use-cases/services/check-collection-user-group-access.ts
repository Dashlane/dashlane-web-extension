import { CollectionDownload } from "@dashlane/server-sdk/v1";
import { SharingUserGroup, Status } from "@dashlane/sharing-contracts";
import { CollectionAccessData } from "./collection-access-types";
import { getHighestPermission } from "../../../utils/get-highest-permission";
import { SharedCollectionAccessLinkTypes } from "../../../sharing-collections/data-access/shared-collections.state";
export const checkUserGroupAccess = (
  collection: CollectionDownload,
  login: string,
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
      const user = userGroup?.users.find(
        (userPair) => userPair.userId === login
      );
      if (user?.groupKey) {
        const resolvedDecryptionLink = {
          permission,
          acceptSignature,
          proposeSignature,
          encryptedResourceKey: userGroupMember.collectionKey,
          groupEncryptedKey: user.groupKey,
          groupPrivateKey: userGroup?.privateKey,
          accessType: SharedCollectionAccessLinkTypes.UserGroup,
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
