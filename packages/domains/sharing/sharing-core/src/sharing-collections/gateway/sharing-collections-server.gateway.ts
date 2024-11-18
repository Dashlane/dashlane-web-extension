import { firstValueFrom } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import { getSuccess, isFailure } from "@dashlane/framework-types";
import { SharedCollection } from "@dashlane/sharing-contracts";
import {
  convertToCreateCollectionPayload,
  convertToUserGroupInvitesPayload,
  convertToUserInvitesPayload,
} from "./sharing-collections-adapters";
import { SharingCollectionsGateway } from "../handlers/common/sharing-collections.gateway";
import {
  AddItemGroupsToCollectionModel,
  CreateCollectionModel,
  InviteCollectionMembersModel,
  ItemGroupModel,
  RemoveItemGroupCollectionAccessModel,
  RenameCollectionModel,
  RevokeCollectionMembersModel,
  UpdateCollectionMembersModel,
} from "../handlers/common/types";
import { makeAuditLogDetails } from "../../sharing-common/helpers/make-audit-log-details";
@Injectable()
export class SharingCollectionsServerGateway
  implements SharingCollectionsGateway
{
  public constructor(private serverApiClient: ServerApiClient) {}
  public async createCollection(params: CreateCollectionModel) {
    const createCollectionResult = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.createCollection(
        convertToCreateCollectionPayload(params)
      )
    );
    if (isFailure(createCollectionResult)) {
      throw new Error("Failed to create shared collection from private one");
    }
    const createdCollection = getSuccess(
      createCollectionResult
    ).data.collections?.find(
      (collection) => collection.uuid === params.collectionId
    );
    if (!createdCollection) {
      throw new Error("Unable to find collection");
    }
    return createdCollection;
  }
  public async renameCollection(params: RenameCollectionModel) {
    const { collectionId: collectionUUID, revision, updatedName } = params;
    const result = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.renameCollection({
        collectionUUID,
        revision,
        updatedName,
      })
    );
    if (isFailure(result)) {
      throw new Error("Failed to rename shared collection");
    }
  }
  public async addItemGroupsToCollection(
    params: AddItemGroupsToCollectionModel
  ) {
    const itemGroupBatches: Array<ItemGroupModel[]> = [];
    for (let i = 0; i < params.itemGroups.length; i += 100) {
      itemGroupBatches.push(params.itemGroups.slice(i, i + 100));
    }
    let currentRevision = params.revision;
    for (const itemGroupBatch of itemGroupBatches) {
      const response = await firstValueFrom(
        this.serverApiClient.v1.sharingUserdevice.addItemGroupsToCollection({
          collectionUUID: params.collectionId,
          itemGroups: itemGroupBatch.map(
            ({
              id,
              proposeSignature,
              acceptSignature,
              permission,
              resourceKey,
              auditLogData,
            }) => ({
              uuid: id,
              proposeSignature,
              acceptSignature,
              permission,
              itemGroupKey: resourceKey,
              auditLogDetails: auditLogData
                ? makeAuditLogDetails(auditLogData)
                : undefined,
            })
          ),
          revision: currentRevision,
        })
      );
      if (isFailure(response)) {
        throw new Error("Failed to add items to collection", {
          cause: response.error,
        });
      }
      const responseData = getSuccess(response).data;
      if (!responseData.collections?.length) {
        throw new Error("Failed to add items to collection");
      }
      currentRevision = responseData.collections[0].revision;
    }
  }
  public async deleteCollection(collectionUUID: string, revision: number) {
    const params = {
      collectionUUID,
      revision,
    };
    const result = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.deleteCollection(params)
    );
    if (isFailure(result)) {
      throw new Error("Failed to delete shared collection");
    }
  }
  public async inviteCollectionMembers({
    collectionId,
    revision,
    users,
    userGroups,
  }: InviteCollectionMembersModel) {
    const params = {
      collectionUUID: collectionId,
      revision,
      users: users ? convertToUserInvitesPayload(users) : undefined,
      userGroups: userGroups
        ? convertToUserGroupInvitesPayload(userGroups)
        : undefined,
    };
    const inviteMembersResponse$ =
      this.serverApiClient.v1.sharingUserdevice.inviteCollectionMembers(params);
    const response = await firstValueFrom(inviteMembersResponse$);
    if (isFailure(response) || !response.data.data.collections) {
      throw new Error("Failed to add members to collection");
    }
    return response.data.data.collections[0];
  }
  public async updateCollectionMembers({
    collectionId,
    revision,
    users,
    userGroups,
  }: UpdateCollectionMembersModel) {
    const params = {
      collectionUUID: collectionId,
      revision,
      users,
      userGroups: userGroups?.map(({ groupId, permission }) => ({
        groupUUID: groupId,
        permission,
      })),
    };
    const updateMembersResponse$ =
      this.serverApiClient.v1.sharingUserdevice.updateCollectionMembers(params);
    const response = await firstValueFrom(updateMembersResponse$);
    if (isFailure(response) || !response.data.data.collections) {
      throw new Error("Failed to update collection members");
    }
    return response.data.data.collections[0];
  }
  public async revokeCollectionMembers({
    collectionId,
    revision,
    userGroupIds,
    userLogins,
  }: RevokeCollectionMembersModel) {
    const revokeCollectionMembersResult$ =
      this.serverApiClient.v1.sharingUserdevice.revokeCollectionMembers({
        collectionUUID: collectionId,
        revision,
        userLogins,
        userGroupUUIDs: userGroupIds,
      });
    const response = await firstValueFrom(revokeCollectionMembersResult$);
    if (isFailure(response) || !response.data.data.collections) {
      throw new Error("Failed to revoke access to collection");
    }
    const responseData = response.data.data.collections[0];
    return responseData;
  }
  public async removeItemGroupsFromCollection(
    collection: SharedCollection,
    itemGroupIds: string[]
  ) {
    const result = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.removeItemGroupsFromCollection({
        collectionUUID: collection.uuid,
        itemGroupUUIDs: itemGroupIds,
        revision: collection.revision,
      })
    );
    if (isFailure(result)) {
      throw new Error("Failure to remove items from collection");
    }
  }
  public async removeItemGroupCollectionAccess(
    params: RemoveItemGroupCollectionAccessModel
  ) {
    const { collectionId, itemGroupId, itemGroupRevision, auditLogData } =
      params;
    const result = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.revokeItemGroupMembers({
        revision: itemGroupRevision,
        groupId: itemGroupId,
        collections: [collectionId],
        auditLogDetails: auditLogData
          ? makeAuditLogDetails(auditLogData)
          : undefined,
      })
    );
    if (isFailure(result)) {
      throw new Error(
        "Failure to remove collection member from an item group",
        {
          cause: result.error,
        }
      );
    }
  }
}
