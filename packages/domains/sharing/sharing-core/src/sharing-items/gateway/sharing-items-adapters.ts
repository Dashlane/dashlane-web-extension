import { ItemForEmailing } from "@dashlane/server-sdk/v1";
import { ShareableItemType } from "@dashlane/sharing-contracts";
import { UserGroupInvite, UserInvite } from "../../sharing-common";
export const convertToUserInvitesPayload = (users: UserInvite[]) =>
  users.map(
    ({
      id,
      resourceKey,
      proposeSignature,
      proposeSignatureUsingAlias,
      acceptSignature,
      alias,
      permission,
    }) => {
      const withAlias = resourceKey ? {} : { proposeSignatureUsingAlias: true };
      return {
        ...withAlias,
        userId: id,
        groupKey: resourceKey,
        proposeSignature,
        proposeSignatureUsingAlias,
        acceptSignature,
        alias,
        permission,
      };
    }
  );
export const convertToUserGroupInvitesPayload = (
  userGroups: UserGroupInvite[]
) =>
  userGroups.map(
    ({ id, resourceKey, proposeSignature, acceptSignature, permission }) => ({
      groupId: id,
      groupKey: resourceKey,
      proposeSignature,
      acceptSignature,
      permission,
    })
  );
export const makeItemForEmailing = (
  title: string,
  type: ShareableItemType
): ItemForEmailing => {
  const name = title || `Untitled ${type}`;
  return { type, name };
};
