import { Injectable } from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import { ShareItemInvitesModel } from "../handlers/common/types";
import { firstValueFrom } from "rxjs";
import {
  convertToUserGroupInvitesPayload,
  convertToUserInvitesPayload,
  makeItemForEmailing,
} from "./sharing-items-adapters";
import { getSuccess, isFailure, success } from "@dashlane/framework-types";
import { makeAuditLogDetails } from "../../sharing-common/helpers/make-audit-log-details";
import {
  ShareItemErrorCode,
  SharingItemsGateway,
} from "../handlers/common/sharing-items.gateway";
@Injectable()
export class SharingItemsServerGateway implements SharingItemsGateway {
  public constructor(private serverApiClient: ServerApiClient) {}
  public async inviteMultipleItemGroupsMembers(
    sharedItems: ShareItemInvitesModel[]
  ) {
    const params = sharedItems.map(({ sharedItem, users, userGroups }) => {
      const { sharedItemId, revision, auditLogData, itemType, title } =
        sharedItem;
      return {
        groupId: sharedItemId,
        revision,
        users: users?.length ? convertToUserInvitesPayload(users) : undefined,
        groups: userGroups?.length
          ? convertToUserGroupInvitesPayload(userGroups)
          : undefined,
        auditLogDetails: auditLogData
          ? makeAuditLogDetails(auditLogData)
          : undefined,
        itemsForEmailing: [makeItemForEmailing(title, itemType)],
      };
    });
    const inviteMembersResponse = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.inviteMultipleItemGroupMembers({
        itemgroups: params,
      })
    );
    if (isFailure(inviteMembersResponse)) {
      throw new Error("Failed to add members to item group");
    }
    const result = getSuccess(inviteMembersResponse).data;
    const errors = result.itemGroupErrors?.map(({ groupId, message }) => ({
      sharedItemId: groupId,
      error: this.mapServerError(message),
      revision: result.itemGroups?.find(
        (itemGroup) => itemGroup.groupId === groupId
      )?.revision,
    }));
    return success({ errors });
  }
  private mapServerError(message: string) {
    switch (message) {
      case ShareItemErrorCode.USER_IS_NOT_MEMBER_OF_TEAM:
        return ShareItemErrorCode.USER_IS_NOT_MEMBER_OF_TEAM;
      case ShareItemErrorCode.INSUFFICIENT_PERMISSION_PRIVILEGES:
        return ShareItemErrorCode.INSUFFICIENT_PERMISSION_PRIVILEGES;
      case ShareItemErrorCode.NOT_A_MEMBER_CANNOT_SHARE_WITH_USER_GROUP:
        return ShareItemErrorCode.NOT_A_MEMBER_CANNOT_SHARE_WITH_USER_GROUP;
      case ShareItemErrorCode.SHARED_ITEM_IS_NOT_FOUND:
        return ShareItemErrorCode.SHARED_ITEM_IS_NOT_FOUND;
      case ShareItemErrorCode.INVALID_REVISION:
        return ShareItemErrorCode.INVALID_REVISION;
      case ShareItemErrorCode.SHARING_DISABLED_BY_TEAM:
        return ShareItemErrorCode.SHARING_DISABLED_BY_TEAM;
      default:
        return ShareItemErrorCode.SERVER_ERROR;
    }
  }
}
