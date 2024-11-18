import { Action } from "Store";
import {
  SharingData,
  UserGroupDownload,
} from "Session/Store/sharingData/types";
export const SHARING_DATA_ITEMS_UPDATED = "SHARING_DATA_ITEMS_UPDATED";
export const USER_GROUPS_UPDATED = "USER_GROUPS_UPDATED";
export interface SharingDataUpdatedAction extends Action {
  sharingData: SharingData;
}
export const sharingDataUpdated = (
  sharingData: SharingData
): SharingDataUpdatedAction => ({
  type: SHARING_DATA_ITEMS_UPDATED,
  sharingData,
});
export interface UserGroupsUpdatedAction extends Action {
  userGroups: UserGroupDownload[];
}
export const userGroupsUpdated = (
  userGroups: UserGroupDownload[]
): UserGroupsUpdatedAction => ({
  type: USER_GROUPS_UPDATED,
  userGroups,
});
export interface SharingActionsEnableAction extends Action {
  isEnabled: boolean;
}
