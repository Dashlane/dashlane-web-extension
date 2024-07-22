import { CreateCollectionPayload } from "@dashlane/server-sdk/v1";
import { UserGroupInvite, UserInvite } from "../../sharing-common";
import { CreateCollectionModel } from "../handlers/common/types";
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
    }) => ({
      login: id,
      collectionKey: resourceKey,
      proposeSignature,
      proposeSignatureUsingAlias,
      acceptSignature,
      alias,
      permission,
    })
  );
export const convertToUserGroupInvitesPayload = (
  userGroups: UserGroupInvite[]
) =>
  userGroups.map(
    ({ id, resourceKey, proposeSignature, acceptSignature, permission }) => ({
      groupUUID: id,
      collectionKey: resourceKey,
      proposeSignature,
      acceptSignature,
      permission,
    })
  );
export const convertToCreateCollectionPayload = (
  input: CreateCollectionModel
): CreateCollectionPayload => {
  const {
    collectionId,
    collectionName,
    users,
    userGroups,
    publicKey,
    privateKey,
    teamId,
  } = input;
  return {
    collectionUUID: collectionId,
    collectionName,
    publicKey,
    privateKey,
    teamId,
    users: convertToUserInvitesPayload(users),
    userGroups: userGroups
      ? convertToUserGroupInvitesPayload(userGroups)
      : undefined,
  };
};
