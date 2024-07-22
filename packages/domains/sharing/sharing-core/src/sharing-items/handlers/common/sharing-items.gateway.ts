import { Result } from "@dashlane/framework-types";
import { ShareItemInvitesModel } from "./types";
export enum ShareItemErrorCode {
  SHARED_ITEM_IS_NOT_FOUND = "ITEM_GROUP_IS_NOT_FOUND",
  INSUFFICIENT_PERMISSION_PRIVILEGES = "INSUFFICIENT_PERMISSION_PRIVILEGES",
  INVALID_REVISION = "INVALID_ITEM_GROUP_REVISION",
  NOT_A_MEMBER_CANNOT_SHARE_WITH_USER_GROUP = "NOT_A_MEMBER_CANNOT_SHARE_WITH_USER_GROUP",
  SHARING_DISABLED_BY_TEAM = "SHARING_DISABLED_BY_TEAM",
  USER_IS_NOT_MEMBER_OF_TEAM = "USER_IS_NOT_MEMBER_OF_TEAM",
  SERVER_ERROR = "SERVER_ERROR",
}
export type ShareItemResult = {
  errors?: {
    sharedItemId: string;
    error: ShareItemErrorCode;
    latestRevision?: number;
  }[];
};
export abstract class SharingItemsGateway {
  abstract inviteMultipleItemGroupsMembers: (
    params: ShareItemInvitesModel[]
  ) => Promise<Result<ShareItemResult>>;
}
