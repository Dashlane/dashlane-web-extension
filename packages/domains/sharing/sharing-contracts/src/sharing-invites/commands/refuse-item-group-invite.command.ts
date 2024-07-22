import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { FunctionalError } from "@dashlane/framework-types";
export interface RefuseItemGroupInviteCommandParam {
  itemGroupId: string;
}
export enum RefuseItemGroupInviteResultErrorCode {
  ItemGroupNotFound = "ItemGroupNotFound",
  AuthorHasInvalidStatus = "AuthorHasInvalidStatus",
  GroupHasInvalidStatus = "GroupHasInvalidStatus",
  UserIsNotInItemGroup = "UserIsNotInItemGroup",
  UserGroupIsNotInItemGroup = "UserGroupIsNotInItemGroup",
  InvalidItemGroupRevision = "InvalidItemGroupRevision",
  NotEnoughAdmins = "NotEnoughAdmins",
  UserIsNotInPendingStatus = "UserIsNotInPendingStatus",
}
export class RefuseItemGroupInviteNotFoundError extends FunctionalError(
  RefuseItemGroupInviteResultErrorCode.ItemGroupNotFound,
  "Item Group not found"
) {}
export class RefuseItemGroupInviteAuthorHasInvalidStatusError extends FunctionalError(
  RefuseItemGroupInviteResultErrorCode.AuthorHasInvalidStatus,
  "User is not in accepted/pending status (already refused or revoked)"
) {}
export class RefuseItemGroupInviteGroupHasInvalidStatusError extends FunctionalError(
  RefuseItemGroupInviteResultErrorCode.GroupHasInvalidStatus,
  "UserGroup is not in accepted/pending status (already refused or revoked)"
) {}
export class RefuseItemGroupInviteUserIsNotInItemGroupError extends FunctionalError(
  RefuseItemGroupInviteResultErrorCode.UserIsNotInItemGroup,
  "User is not part of item group"
) {}
export class RefuseItemGroupInviteUserGroupIsNotInItemGroupError extends FunctionalError(
  RefuseItemGroupInviteResultErrorCode.UserGroupIsNotInItemGroup,
  "User group is not part of item group"
) {}
export class RefuseItemGroupInviteInvalidItemGroupRevisionError extends FunctionalError(
  RefuseItemGroupInviteResultErrorCode.InvalidItemGroupRevision,
  "Item group revision is not valid"
) {}
export class RefuseItemGroupInviteNotEnoughAdminsError extends FunctionalError(
  RefuseItemGroupInviteResultErrorCode.NotEnoughAdmins,
  "The operation would let the item group with no admin"
) {}
export class RefuseItemGroupInviteUserIsNotInPendingStatusError extends FunctionalError(
  RefuseItemGroupInviteResultErrorCode.UserIsNotInPendingStatus,
  'User is not in "pending" status or not part of a group'
) {}
export type RefuseItemGroupInviteError =
  | RefuseItemGroupInviteNotFoundError
  | RefuseItemGroupInviteAuthorHasInvalidStatusError
  | RefuseItemGroupInviteGroupHasInvalidStatusError
  | RefuseItemGroupInviteUserIsNotInItemGroupError
  | RefuseItemGroupInviteUserGroupIsNotInItemGroupError
  | RefuseItemGroupInviteInvalidItemGroupRevisionError
  | RefuseItemGroupInviteNotEnoughAdminsError
  | RefuseItemGroupInviteUserIsNotInPendingStatusError;
export function getRefuseItemGroupInviteFunctionalError(
  code: string
): RefuseItemGroupInviteError {
  switch (code) {
    case "AUTHOR_HAS_INVALID_STATUS": {
      return new RefuseItemGroupInviteAuthorHasInvalidStatusError();
    }
    case "GROUP_HAS_INVALID_STATUS": {
      return new RefuseItemGroupInviteGroupHasInvalidStatusError();
    }
    case "USER_IS_NOT_IN_ITEM_GROUP": {
      return new RefuseItemGroupInviteUserIsNotInItemGroupError();
    }
    case "USER_GROUP_IS_NOT_IN_ITEM_GROUP": {
      return new RefuseItemGroupInviteUserGroupIsNotInItemGroupError();
    }
    case "INVALID_ITEM_GROUP_REVISION": {
      return new RefuseItemGroupInviteInvalidItemGroupRevisionError();
    }
    case "NOT_ENOUGH_ADMINS": {
      return new RefuseItemGroupInviteNotEnoughAdminsError();
    }
    case "USER_IS_NOT_IN_PENDING_STATUS": {
      return new RefuseItemGroupInviteUserIsNotInPendingStatusError();
    }
    default: {
      throw new Error("Unknown server error");
    }
  }
}
export class RefuseItemGroupInviteCommand extends defineCommand<
  RefuseItemGroupInviteCommandParam,
  undefined,
  RefuseItemGroupInviteError
>({ scope: UseCaseScope.User }) {}
