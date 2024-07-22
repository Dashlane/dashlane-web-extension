import { CollectionItemPermission } from "@dashlane/sharing-contracts";
import {
  AuditLogData,
  SharingInvite,
  SharingUserGroupRecipient,
  SharingUserRecipient,
  UserGroupInvite,
  UserInvite,
} from "../../../sharing-common";
export interface CreateCollectionModel {
  collectionId: string;
  collectionName: string;
  users: UserInvite[];
  userGroups?: UserGroupInvite[];
  publicKey: string;
  privateKey: string;
  teamId: number;
}
export interface RenameCollectionModel {
  revision: number;
  collectionId: string;
  updatedName: string;
}
export interface InviteCollectionMembersModel {
  revision: number;
  collectionId: string;
  users?: UserInvite[];
  userGroups?: UserGroupInvite[];
}
export interface UpdateCollectionMembersModel {
  revision: number;
  collectionId: string;
  users?: SharingUserRecipient[];
  userGroups?: SharingUserGroupRecipient[];
}
export interface RevokeCollectionMembersModel {
  revision: number;
  collectionId: string;
  userLogins?: string[];
  userGroupIds?: string[];
}
export interface RemoveItemGroupCollectionAccessModel {
  collectionId: string;
  itemGroupId: string;
  itemGroupRevision: number;
  auditLogData?: AuditLogData;
}
export type ItemGroupModel = SharingInvite & {
  id: string;
  acceptSignature: string;
  auditLogData?: AuditLogData;
  resourceKey: string;
};
export interface AddItemGroupsToCollectionModel {
  revision: number;
  collectionId: string;
  itemGroups: ItemGroupModel[];
}
export interface UpdateItemPermissionInCollectionModel {
  revision: number;
  groupId: string;
  collection: CollectionItemPermission;
}
