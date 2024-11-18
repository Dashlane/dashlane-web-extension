import { Action } from "Store";
import {
  TeamAdminData,
  UserGroupAdminItem,
} from "Session/Store/teamAdminData/types";
import {
  ItemGroupDownload,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
export const TEAM_ADMIN_USER_GROUPS_UPDATED = "TEAM_ADMIN_USER_GROUPS_UPDATED";
export const TEAM_ADMIN_USER_GROUPS_CREATED = "TEAM_ADMIN_USER_GROUPS_CREATED";
export const TEAM_ADMIN_USER_GROUPS_DELETED = "TEAM_ADMIN_USER_GROUPS_DELETED";
export const TEAM_ADMIN_DATA_UPDATED = "TEAM_ADMIN_DATA_UPDATED";
export const GROUP_ADMIN_ITEM_CREATED = "GROUP_ADMIN_ITEM_CREATED";
export const SPECIAL_ITEM_GROUP_UPDATED = "SPECIAL_ITEM_GROUP_UPDATED";
export interface UserGroupsUpdatedAction extends Action {
  teamId: string;
  userGroups: UserGroupDownload[];
}
export const userGroupsUpdated = (
  teamId: string,
  userGroups: UserGroupDownload[]
): UserGroupsUpdatedAction => ({
  type: TEAM_ADMIN_USER_GROUPS_UPDATED,
  teamId,
  userGroups,
});
export interface UserGroupsCreatedAction extends Action {
  teamId: string;
  userGroups: UserGroupDownload[];
}
export const userGroupsCreated = (
  teamId: string,
  userGroups: UserGroupDownload[]
): UserGroupsCreatedAction => ({
  type: TEAM_ADMIN_USER_GROUPS_CREATED,
  teamId,
  userGroups,
});
export interface UserGroupsDeletedAction extends Action {
  teamId: string;
  userGroups: UserGroupDownload[];
}
export const userGroupsDeleted = (
  teamId: string,
  userGroups: UserGroupDownload[]
): UserGroupsDeletedAction => ({
  type: TEAM_ADMIN_USER_GROUPS_DELETED,
  teamId,
  userGroups,
});
export interface TeamAdminDataUpdatedAction extends Action {
  teamAdminData: TeamAdminData;
}
export const teamAdminDataUpdated = (
  teamAdminData: TeamAdminData
): TeamAdminDataUpdatedAction => ({
  type: TEAM_ADMIN_DATA_UPDATED,
  teamAdminData,
});
export interface UserGroupAdminItemCreatedAction extends Action {
  teamId: string;
  userGroupAdminItem: UserGroupAdminItem;
}
export const userGroupAdminItemCreated = (
  teamId: string,
  userGroupAdminItem: UserGroupAdminItem
): UserGroupAdminItemCreatedAction => ({
  type: GROUP_ADMIN_ITEM_CREATED,
  teamId,
  userGroupAdminItem,
});
export interface SpecialItemGroupUpdatedAction extends Action {
  teamId: string;
  specialItemGroup: ItemGroupDownload;
}
export const specialItemGroupUpdated = (
  teamId: string,
  specialItemGroup: ItemGroupDownload
): SpecialItemGroupUpdatedAction => ({
  type: SPECIAL_ITEM_GROUP_UPDATED,
  teamId,
  specialItemGroup,
});
