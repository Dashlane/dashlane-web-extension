import { DataQuery } from "../../data-management";
import { Credential, Note, Secret } from "../../DataModel";
import { MemberPermission } from "./Interfaces";
export interface ShareItemFailure {
  success: false;
  error?: {
    code: string;
  };
}
export interface ShareItemSuccess {
  success: true;
}
export type ShareItemResult = ShareItemFailure | ShareItemSuccess;
export interface ConvertItemToDashlaneXmlFailure {
  success: false;
  error?: {
    code: string;
  };
}
export interface ConvertItemToDashlaneXmlSuccess {
  success: true;
  xml: string;
}
export type ConvertItemToDashlaneXmlResult =
  | ConvertItemToDashlaneXmlFailure
  | ConvertItemToDashlaneXmlSuccess;
export interface ConvertItemToDashlaneXmlRequest {
  item: Credential | Note | Secret;
}
export interface ConvertDashlaneXmlToItemFailure {
  success: false;
  error?: {
    code: string;
  };
}
export interface ConvertDashlaneXmlToItemSuccess {
  success: true;
  item: Credential | Note | Secret;
}
export type ConvertDashlaneXmlToItemResult =
  | ConvertDashlaneXmlToItemFailure
  | ConvertDashlaneXmlToItemSuccess;
export interface ConvertDashlaneXmlToItemRequest {
  xml: string;
}
export interface SaveSharedItemsToVaultRequest {
  items: Array<Credential | Note | Secret>;
}
export type Unlimited = {
  type: "unlimited";
};
export type Limited = {
  type: "limited";
  remains: number;
};
export type SharingCapacity = Limited | Unlimited;
export interface UserGroupMemberView {
  id: string;
  permission: MemberPermission;
}
export interface UserGroupView {
  id: string;
  name: string;
  users: UserGroupMemberView[];
  itemCount: number;
}
export type UserGroupFilterField = "name" | "itemCount";
export type UserGroupSortField = "name" | "id";
export type UserGroupDataQuery = DataQuery<
  UserGroupSortField,
  UserGroupFilterField
>;
export interface UserGroupDataQueryRequest {
  dataQuery: UserGroupDataQuery;
  spaceId: string | null;
}
export interface UserGroupPermissionLevelRequest {
  itemId: string;
  groupId: string;
}
export type UserGroupMembersFilterField = "id";
export type UserGroupMembersSortField = "id";
export type UserGroupMembersDataQuery = DataQuery<
  UserGroupMembersSortField,
  UserGroupMembersFilterField
>;
export interface GetUserGroupMembersRequest {
  dataQuery: UserGroupMembersDataQuery;
  groupId: string;
}
export interface SharingUserView {
  id: string;
  itemCount: number;
}
export type SharingUserFilterField = "id" | "itemCount";
export type SharingUserSortField = "id";
export type SharingUserDataQuery = DataQuery<
  SharingUserSortField,
  SharingUserFilterField
>;
export interface SharingUserDataQueryRequest {
  dataQuery: SharingUserDataQuery;
  spaceId: string | null;
}
export interface SharingUserPermissionLevelRequest {
  itemId: string;
  userId: string;
}
