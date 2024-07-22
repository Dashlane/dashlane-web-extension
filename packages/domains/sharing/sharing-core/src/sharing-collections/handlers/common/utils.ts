import {
  Permission,
  SharedCollectionRole,
  type SharedCollectionUserGroupRecipient,
  type SharedCollectionUserRecipient,
} from "@dashlane/sharing-contracts";
const mapRoleToPermission = (role: SharedCollectionRole) =>
  role === SharedCollectionRole.Manager ? Permission.Admin : Permission.Limited;
export const userRecipientMapper = (
  recipient: SharedCollectionUserRecipient
) => ({
  login: recipient.login,
  permission: mapRoleToPermission(recipient.role),
});
export const userGroupRecipientMapper = (
  recipient: SharedCollectionUserGroupRecipient
) => ({
  groupId: recipient.groupId,
  permission: mapRoleToPermission(recipient.role),
});
