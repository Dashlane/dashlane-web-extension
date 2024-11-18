import {
  SharedItemAccessLinkTypes,
  SharingUserGroup,
  Status,
} from "@dashlane/sharing-contracts";
import { ItemGroupDownload } from "@dashlane/server-sdk/v1";
import { AccessData } from "./item-group-adapter.types";
import { getHighestPermission } from "../get-highest-permission";
export const checkUserGroupAccess = (
  itemGroup: ItemGroupDownload,
  myUserGroups: SharingUserGroup[]
): AccessData | null => {
  const userGroupMembers = itemGroup.groups?.filter(
    (userGroup) =>
      myUserGroups.some(
        (userGroupPair) => userGroupPair.groupId === userGroup.groupId
      ) &&
      userGroup.status === Status.Accepted &&
      userGroup.groupKey
  );
  if (userGroupMembers?.length) {
    const userGroupMember = userGroupMembers[0];
    const resolvedPermission = getHighestPermission(userGroupMembers);
    if (userGroupMember.groupKey) {
      const { permission, acceptSignature, proposeSignature } = userGroupMember;
      const userGroup = myUserGroups.find(
        (userGroupPair) => userGroupPair.groupId === userGroupMember.groupId
      );
      if (userGroup?.groupKey) {
        const resolvedDecryptionLink = {
          permission,
          acceptSignature,
          proposeSignature,
          encryptedResourceKey: userGroupMember.groupKey,
          groupEncryptedKey: userGroup.groupKey,
          groupPrivateKey: userGroup.privateKey,
          groupPublicKey: userGroup.publicKey,
          accessType: SharedItemAccessLinkTypes.UserGroup,
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
