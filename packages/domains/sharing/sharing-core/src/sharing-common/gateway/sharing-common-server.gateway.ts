import { firstValueFrom } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import {
  failure,
  getSuccess,
  isFailure,
  mapFailureObservable,
  mapSuccessResultObservable,
  success,
} from "@dashlane/framework-types";
import { sanitizeEmail } from "../../utils/sanitize-email";
import {
  convertToUserInvitesPayload,
  makeItemForEmailing,
} from "./sharing-adapters";
import {
  ITEM_GROUP_MEMBER_INVALID_REVISION,
  itemGroupMemberInvalidRevisionError,
  SharingCommonGateway,
} from "../services/sharing.gateway";
import {
  ItemGroupCreateModel,
  RefuseItemGroupModel,
  RevokeItemGroupMembersModel,
  UpdateItemGroupMembersModel,
} from "../sharing.types";
@Injectable()
export class SharingCommonServerGateway implements SharingCommonGateway {
  public constructor(private serverApiClient: ServerApiClient) {}
  public async getPublicKeysForUsers(users: string[]) {
    const usersWithPublicKeys = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice
        .getUsersPublicKey({
          logins: users,
        })
        .pipe(
          mapFailureObservable(() => {
            throw new Error("Cannot get public keys of requested users.");
          }),
          mapSuccessResultObservable((result) => {
            return success(result.data);
          })
        )
    );
    if (isFailure(usersWithPublicKeys)) {
      throw new Error("Cannot get public keys of requested users.");
    }
    const parsedUsersWithPublicKeys = usersWithPublicKeys.data.data;
    return parsedUsersWithPublicKeys.map((user) => ({
      login: user.login ?? sanitizeEmail(user.email),
      publicKey: user.publicKey,
    }));
  }
  public async createItemGroup({
    users,
    item,
    itemTitle,
    groupId,
  }: ItemGroupCreateModel) {
    const response = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.createItemGroup({
        groupId,
        items: [item],
        users: convertToUserInvitesPayload(users),
        itemsForEmailing: [makeItemForEmailing(item.itemType, itemTitle)],
      })
    );
    if (isFailure(response)) {
      throw new Error("Failed to create item group");
    }
    const newItemGroup = getSuccess(response).data.itemGroups?.find(
      (itemGroup) => itemGroup.groupId === groupId
    );
    if (!newItemGroup) {
      throw new Error("Error creating item group");
    }
    return newItemGroup;
  }
  public async createMultipleItemGroups(
    itemGroupModels: ItemGroupCreateModel[]
  ) {
    const itemGroups = itemGroupModels.map(
      ({ users, item, itemTitle, groupId }) => ({
        groupId,
        items: [item],
        users: convertToUserInvitesPayload(users),
        itemsForEmailing: [makeItemForEmailing(item.itemType, itemTitle)],
      })
    );
    const response = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.createMultipleItemGroups({
        itemgroups: itemGroups,
      })
    );
    if (isFailure(response)) {
      throw new Error("Failed to create multiple item groups");
    }
    const responseData = getSuccess(response).data;
    if (responseData.itemGroupErrors?.length) {
      throw new Error("Failed to create some of multiple item groups");
    }
    if (!responseData.itemGroups?.length) {
      throw new Error("No item groups have been created");
    }
    return responseData.itemGroups;
  }
  public async updateItemGroupMembers(
    updateModel: UpdateItemGroupMembersModel
  ) {
    const { groupId, revision, users, groups, collections } = updateModel;
    const response = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.updateItemGroupMembers({
        groupId,
        revision,
        collections,
        groups,
        users,
      })
    );
    if (isFailure(response)) {
      if (
        response.error.tag === "BusinessError" &&
        response.error.code === ITEM_GROUP_MEMBER_INVALID_REVISION
      ) {
        return failure(itemGroupMemberInvalidRevisionError());
      }
      throw new Error("Updating members of item groups have failed");
    }
    const responseData = getSuccess(response).data;
    return success(responseData.itemGroups);
  }
  public async revokeItemGroupMembers(
    revokeModel: RevokeItemGroupMembersModel
  ) {
    const { itemGroupId, revision, userLogins, collectionIds, userGroupIds } =
      revokeModel;
    const response = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.revokeItemGroupMembers({
        groupId: itemGroupId,
        revision,
        collections: collectionIds,
        users: userLogins,
        groups: userGroupIds,
      })
    );
    if (isFailure(response)) {
      if (
        response.error.tag === "BusinessError" &&
        response.error.code === ITEM_GROUP_MEMBER_INVALID_REVISION
      ) {
        return failure(itemGroupMemberInvalidRevisionError());
      }
      throw new Error("Revoking members of item groups have failed");
    }
    const responseData = getSuccess(response).data;
    return success(responseData.itemGroups);
  }
  public async refuseItemGroup(refuseModel: RefuseItemGroupModel) {
    const { itemGroupId, revision } = refuseModel;
    const response = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.refuseItemGroup({
        groupId: itemGroupId,
        revision: revision,
      })
    );
    if (isFailure(response)) {
      throw new Error("Refusing item group have failed");
    }
    const responseData = getSuccess(response).data;
    if (!responseData.itemGroups?.length) {
      throw new Error("No members of item groups have been revoked");
    }
    if (responseData.itemGroupErrors?.length) {
      throw new Error("Revoking of some members of item groups failed");
    }
    return responseData.itemGroups;
  }
}
