import { AdminData, TeamAdminData } from "Session/Store/teamAdminData/types";
export enum SyncUserGroupManagementStatus {
  NEEDS_FRESH_SHARING_DATA,
  COMPLETE,
}
export interface SyncUserGroupManagementForAllTeamsResult {
  status: SyncUserGroupManagementStatus;
  teamAdminData: TeamAdminData;
}
export interface SyncUserGroupManagementResult {
  status: SyncUserGroupManagementStatus;
  adminData: AdminData;
}
