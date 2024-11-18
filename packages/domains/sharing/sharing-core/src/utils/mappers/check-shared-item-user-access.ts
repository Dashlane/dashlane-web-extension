import { ItemGroupDownload } from "@dashlane/server-sdk/v1";
import {
  Permission,
  SharedItemAccessLinkTypes,
  Status,
} from "@dashlane/sharing-contracts";
import { getHighestPermission } from "../get-highest-permission";
import { AccessData } from "./item-group-adapter.types";
export const checkDirectUserAccess = (
  itemGroup: ItemGroupDownload,
  login: string
): AccessData | null => {
  const userMembers = itemGroup.users?.filter(
    (user) =>
      user.userId === login &&
      (user.status === Status.Accepted || user.status === Status.Pending) &&
      user.groupKey
  );
  const otherAdminsFound =
    itemGroup.users?.some(
      ({ userId, permission, rsaStatus, status }) =>
        userId !== login &&
        permission === Permission.Admin &&
        rsaStatus === "sharingKeys" &&
        status === Status.Accepted
    ) ?? false;
  if (userMembers?.length) {
    const userMember = userMembers[0];
    if (userMember.groupKey) {
      const { permission, acceptSignature, proposeSignature } = userMember;
      const resolvedDecryptionLink = {
        permission,
        acceptSignature,
        proposeSignature,
        encryptedResourceKey: userMember.groupKey,
        accessType: SharedItemAccessLinkTypes.User,
      };
      const resolvedPermission = getHighestPermission(userMembers);
      return {
        link: resolvedDecryptionLink,
        permission: resolvedPermission,
        otherAdminsFound,
      };
    }
  }
  return {
    permission: Permission.Limited,
    otherAdminsFound,
  };
};
