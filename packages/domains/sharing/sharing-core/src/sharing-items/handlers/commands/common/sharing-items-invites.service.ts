import { Injectable } from "@dashlane/framework-application";
import { Permission, SharedItem } from "@dashlane/sharing-contracts";
import { Credential, Note, Secret } from "@dashlane/communication";
import { getSuccess, isFailure } from "@dashlane/framework-types";
import { SharingDecryptionService } from "../../../..";
import {
  SharingUserGroupRecipient,
  SharingUserGroupsService,
  SharingUserRecipient,
  SharingUsersService,
} from "../../../../sharing-common";
import { SharingItemsGateway } from "../../common/sharing-items.gateway";
import {
  mapToShareItemErrorDetails,
  mapToShareItemModel,
} from "./share-items-mappers";
@Injectable()
export class SharingItemsInvitesService {
  public constructor(
    private readonly sharingItemsGateway: SharingItemsGateway,
    private sharingDecryption: SharingDecryptionService,
    private sharingUserGroups: SharingUserGroupsService,
    private sharingUsers: SharingUsersService
  ) {}
  public async inviteRecipients(
    userLogins: string[],
    userGroupIds: string[],
    allSharedItems: SharedItem[],
    allVaultItems: Array<Credential | Note | Secret>,
    permission: Permission
  ) {
    const invites = await this.createItemsInvites(
      allSharedItems,
      userLogins.map((login) => ({ login, permission })),
      userGroupIds.map((groupId) => ({ groupId, permission }))
    );
    const shareItemInviteModels = invites.map(
      ({ sharedItem, users, userGroups }) => {
        return {
          sharedItem: mapToShareItemModel(sharedItem, allVaultItems),
          users,
          userGroups,
        };
      }
    );
    const result =
      await this.sharingItemsGateway.inviteMultipleItemGroupsMembers(
        shareItemInviteModels
      );
    if (isFailure(result)) {
      throw new Error("Server error when sharing items");
    }
    return (
      getSuccess(result).errors?.map(({ error, sharedItemId }) => {
        const sharedItem = allSharedItems.find(
          (item) => item.sharedItemId === sharedItemId
        );
        if (!sharedItem) {
          throw new Error(
            "Error when creating invite params for sharing an item"
          );
        }
        return mapToShareItemErrorDetails(
          error,
          sharedItem.itemId,
          allVaultItems
        );
      }) ?? []
    );
  }
  private async createItemsInvites(
    sharedItems: SharedItem[],
    userRecipients: SharingUserRecipient[],
    userGroupRecipients: SharingUserGroupRecipient[]
  ) {
    const resources = await Promise.all(
      sharedItems.map(async (sharedItem) => {
        const clearItemGroupKey =
          await this.sharingDecryption.decryptItemGroupKey(sharedItem);
        if (clearItemGroupKey === null) {
          throw new Error("Unable to decrypt item group key");
        }
        return {
          resourceKey: clearItemGroupKey,
          uuid: sharedItem.sharedItemId,
        };
      })
    );
    const users = await this.sharingUsers.createSignedUserInvitesPerResource(
      userRecipients,
      resources
    );
    const userGroups =
      await this.sharingUserGroups.createSignedUserGroupInvitesPerResource(
        userGroupRecipients,
        resources
      );
    return sharedItems.map((sharedItem) => ({
      sharedItem,
      users: users[sharedItem.sharedItemId],
      userGroups: userGroups[sharedItem.sharedItemId],
    }));
  }
}
