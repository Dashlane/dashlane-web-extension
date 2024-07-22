import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { FunctionalError } from "@dashlane/framework-types";
export interface RefuseUserGroupInviteCommandParam {
  userGroupId: string;
}
export enum RefuseUserGroupInviteResultErrorCode {
  UserGroupNotFound = "UserGroupNotFound",
  InvalidTeamId = "InvalidTeamId",
  UserGroupIsNotFound = "UserGroupIsNotFound",
  InvalidItemGroupRevision = "InvalidItemGroupRevision",
  UserGroupUpdateConflict = "UserGroupUpdateConflict",
  InsufficientPrivileges = "InsufficientPrivileges",
  UserIsNotInUserGroup = "UserIsNotInUserGroup",
  UserIsNotInPendingStatus = "UserIsNotInPendingStatus",
  GroupHasInvalidStatus = "GroupHasInvalidStatus",
  AuthorHasInvalidStatus = "AuthorHasInvalidStatus",
}
export class RefuseUserGroupInviteNotFoundError extends FunctionalError(
  RefuseUserGroupInviteResultErrorCode.UserGroupNotFound,
  "User Group not found"
) {}
export class RefuseUserGroupInviteInvalidTeamIdError extends FunctionalError(
  RefuseUserGroupInviteResultErrorCode.InvalidTeamId,
  "Provided Team ID is not a number"
) {}
export class RefuseUserGroupInviteUserGroupIsNotFoundError extends FunctionalError(
  RefuseUserGroupInviteResultErrorCode.UserGroupIsNotFound,
  "User group for provided ID does not exist"
) {}
export class RefuseUserGroupInviteInvalidItemGroupRevisionError extends FunctionalError(
  RefuseUserGroupInviteResultErrorCode.InvalidItemGroupRevision,
  "User group revision is not valid"
) {}
export class RefuseUserGroupInviteUserGroupUpdateConflictError extends FunctionalError(
  RefuseUserGroupInviteResultErrorCode.UserGroupUpdateConflict,
  "Conflict between users attempting to update the same user group"
) {}
export class RefuseUserGroupInviteInsufficientPrivilegesError extends FunctionalError(
  RefuseUserGroupInviteResultErrorCode.InsufficientPrivileges,
  "The user does not have User Group permission to refuse the invitation"
) {}
export class RefuseUserGroupInviteUserIsNotInUserGroupError extends FunctionalError(
  RefuseUserGroupInviteResultErrorCode.UserIsNotInUserGroup,
  "User is not part of a group"
) {}
export class RefuseUserGroupInviteUserIsNotInPendingStatusError extends FunctionalError(
  RefuseUserGroupInviteResultErrorCode.UserIsNotInPendingStatus,
  'User is not in "pending" status or not part of a group'
) {}
export class RefuseUserGroupInviteGroupHasInvalidStatusError extends FunctionalError(
  RefuseUserGroupInviteResultErrorCode.GroupHasInvalidStatus,
  'UserGroup is not in "accepted" or "pending" status (already refused or revoked)'
) {}
export class RefuseUserGroupInviteAuthorHasInvalidStatusError extends FunctionalError(
  RefuseUserGroupInviteResultErrorCode.AuthorHasInvalidStatus,
  "User is not in accepted/pending status (already refused or revoked)"
) {}
export type RefuseUserGroupInviteError =
  | RefuseUserGroupInviteNotFoundError
  | RefuseUserGroupInviteInvalidTeamIdError
  | RefuseUserGroupInviteUserGroupIsNotFoundError
  | RefuseUserGroupInviteInvalidItemGroupRevisionError
  | RefuseUserGroupInviteUserGroupUpdateConflictError
  | RefuseUserGroupInviteInsufficientPrivilegesError
  | RefuseUserGroupInviteUserIsNotInUserGroupError
  | RefuseUserGroupInviteUserIsNotInPendingStatusError
  | RefuseUserGroupInviteGroupHasInvalidStatusError
  | RefuseUserGroupInviteAuthorHasInvalidStatusError;
export function getRefuseUserGroupInviteFunctionalError(
  code: string
): RefuseUserGroupInviteError {
  switch (code) {
    case "INVALID_TEAM_ID": {
      return new RefuseUserGroupInviteInvalidTeamIdError();
    }
    case "USER_GROUP_IS_NOT_FOUND": {
      return new RefuseUserGroupInviteUserGroupIsNotFoundError();
    }
    case "INVALID_USER_GROUP_REVISION": {
      return new RefuseUserGroupInviteInvalidItemGroupRevisionError();
    }
    case "USER_GROUP_UPDATE_CONFLICT": {
      return new RefuseUserGroupInviteUserGroupUpdateConflictError();
    }
    case "INSUFFICIENT_PRIVILEGES": {
      return new RefuseUserGroupInviteInsufficientPrivilegesError();
    }
    case "USER_IS_NOT_IN_USER_GROUP": {
      return new RefuseUserGroupInviteUserIsNotInUserGroupError();
    }
    case "USER_IS_NOT_IN_PENDING_STATUS": {
      return new RefuseUserGroupInviteUserIsNotInPendingStatusError();
    }
    case "GROUP_HAS_INVALID_STATUS": {
      return new RefuseUserGroupInviteGroupHasInvalidStatusError();
    }
    case "AUTHOR_HAS_INVALID_STATUS": {
      return new RefuseUserGroupInviteAuthorHasInvalidStatusError();
    }
    default: {
      throw new Error("Unknown server error");
    }
  }
}
export class RefuseUserGroupInviteCommand extends defineCommand<
  RefuseUserGroupInviteCommandParam,
  undefined,
  RefuseUserGroupInviteError
>({ scope: UseCaseScope.User }) {}
