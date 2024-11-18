import { AuditLogDetails } from "@dashlane/sharing";
import {
  Permission,
  ShareableItemType,
  Status,
} from "@dashlane/sharing-contracts";
export interface ShareableResource {
  resourceKey: ArrayBuffer;
  uuid: string;
}
export interface SharingUserRecipient {
  login: string;
  permission: Permission;
}
export interface SharingUserGroupRecipient {
  groupId: string;
  permission: Permission;
}
export interface SharingUserItemGroupRecipient {
  userId: string;
  permission?: Permission;
  groupKey?: string;
  proposeSignature?: string;
}
export interface SharingCollectionRecipient {
  collectionUUID: string;
  permission: Permission;
}
export type SharingInvite = SignedInvite & {
  id: string;
  permission: Permission;
};
export type UserGroupInvite = SharingInvite & {
  resourceKey: string;
};
export type UserInvite = SharingInvite & {
  alias: string;
  resourceKey?: string;
};
export interface SignedInvite {
  resourceKey?: string;
  acceptSignature?: string;
  proposeSignature: string;
  proposeSignatureUsingAlias?: boolean;
}
export interface UserWithPublicKey {
  login: string;
  publicKey: string | null;
}
export interface ItemEmailView {
  name: string;
  type: "password" | "note" | "secret";
}
export interface EncryptedItem {
  itemId: string;
  itemType: "SECURENOTE" | "AUTHENTIFIANT" | "SECRET";
  itemKey: string;
  content: string;
}
export type AuditLogData = {
  domain?: string;
  type: ShareableItemType;
};
export interface UpdateItemGroupMembersModel {
  revision: number;
  groupId: string;
  collections?: SharingCollectionRecipient[];
  groups?: SharingUserGroupRecipient[];
  users?: SharingUserItemGroupRecipient[];
}
export interface RevokeItemGroupMembersModel {
  revision: number;
  itemGroupId: string;
  userLogins?: string[];
  userGroupIds?: string[];
  collectionIds?: string[];
  auditLogDetails?: AuditLogDetails;
}
export interface RefuseItemGroupModel {
  revision: number;
  itemGroupId: string;
}
export interface DeleteItemGroupModel {
  groupId: string;
  revision: number;
}
export interface ItemGroupCreateModel {
  groupId: string;
  users: UserInvite[];
  itemTitle: string;
  item: EncryptedItem;
}
export interface User {
  acceptSignature?: string | null;
  alias: string;
  groupKey?: string | null;
  permission: Permission;
  proposeSignature?: string;
  proposeSignatureUsingAlias?: boolean;
  referrer: string;
  rsaStatus?: "noKey" | "publicKey" | "sharingKeys";
  status?: Status;
  userId: string;
}
export interface ItemGroup {
  collections?: {
    uuid: string;
    name: string;
    permission: Permission;
    status: Status;
    itemGroupKey?: string | null;
    proposeSignature?: string;
    acceptSignature?: string | null;
    referrer?: string;
  }[];
  groupId: string;
  groups?: {
    groupId: string;
    name: string;
    permission: Permission;
    status: Status;
    groupKey?: string | null;
    proposeSignature?: string;
    acceptSignature?: string | null;
    referrer?: string;
  }[];
  items?: {
    itemId: string;
    itemKey: string;
  }[];
  revision: number;
  teamId?: number;
  type: "items" | "userGroupKeys";
  users?: User[];
}
