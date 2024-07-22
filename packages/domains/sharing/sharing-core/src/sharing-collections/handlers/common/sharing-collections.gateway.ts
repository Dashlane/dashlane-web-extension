import { SharedCollection } from "@dashlane/sharing-contracts";
import {
  AddItemGroupsToCollectionModel,
  CreateCollectionModel,
  InviteCollectionMembersModel,
  RemoveItemGroupCollectionAccessModel,
  RenameCollectionModel,
  RevokeCollectionMembersModel,
  UpdateCollectionMembersModel,
} from "./types";
export abstract class SharingCollectionsGateway {
  abstract createCollection: (
    params: CreateCollectionModel
  ) => Promise<SharedCollection>;
  abstract renameCollection: (params: RenameCollectionModel) => Promise<void>;
  abstract deleteCollection: (
    collectionId: string,
    revision: number
  ) => Promise<void>;
  abstract inviteCollectionMembers: (
    params: InviteCollectionMembersModel
  ) => Promise<SharedCollection>;
  abstract updateCollectionMembers: (
    params: UpdateCollectionMembersModel
  ) => Promise<SharedCollection>;
  abstract revokeCollectionMembers: (
    params: RevokeCollectionMembersModel
  ) => Promise<SharedCollection>;
  abstract removeItemGroupsFromCollection: (
    collection: SharedCollection,
    itemGroupIds: string[]
  ) => Promise<void>;
  abstract removeItemGroupCollectionAccess: (
    params: RemoveItemGroupCollectionAccessModel
  ) => Promise<void>;
  abstract addItemGroupsToCollection: (
    params: AddItemGroupsToCollectionModel
  ) => Promise<void>;
}
