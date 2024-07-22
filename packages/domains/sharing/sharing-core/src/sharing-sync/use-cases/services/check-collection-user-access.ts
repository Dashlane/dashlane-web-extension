import { Permission, Status } from "@dashlane/sharing-contracts";
import { CollectionDownload } from "@dashlane/server-sdk/v1";
import { CollectionAccessData } from "./collection-access-types";
import { SharedCollectionAccessLinkTypes } from "../../../sharing-collections/data-access/shared-collections.state";
export const checkDirectUserAccess = (
  collection: CollectionDownload,
  login: string
): CollectionAccessData | null => {
  const otherAdminsFound =
    collection.users?.some(
      ({ login: collectionUserLogin, permission, rsaStatus, status }) =>
        collectionUserLogin !== login &&
        permission === Permission.Admin &&
        rsaStatus === "sharingKeys" &&
        status === Status.Accepted
    ) ?? false;
  const userMember = collection.users?.find(
    (user) =>
      user.login === login &&
      user.status === Status.Accepted &&
      user.collectionKey
  );
  if (userMember) {
    if (userMember.collectionKey) {
      const { permission, acceptSignature, proposeSignature } = userMember;
      const resolvedDecryptionLink = {
        permission,
        acceptSignature,
        proposeSignature,
        encryptedResourceKey: userMember.collectionKey,
        accessType: SharedCollectionAccessLinkTypes.User,
      };
      return {
        link: resolvedDecryptionLink,
        permission: userMember.permission,
        otherAdminsFound,
      };
    }
  }
  return {
    permission: Permission.Limited,
    otherAdminsFound,
  };
};
