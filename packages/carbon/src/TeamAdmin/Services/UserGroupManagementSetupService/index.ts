import {
  AdminData,
  TeamAdminData,
  UserGroupAdminItem,
} from "Session/Store/teamAdminData/types";
import { CurrentUserInfo } from "Session/utils";
import { ISharingServices } from "Sharing/2/Services";
import { SpaceData } from "Session/Store/spaceData/types";
import { StoreService } from "Store/index";
import { WSService } from "Libs/WS/index";
import { setupUserGroupManagement } from "TeamAdmin/Services/UserGroupManagementSetupService/setup";
import {
  syncAdminData,
  syncAdministrableTeamList,
} from "TeamAdmin/Services/UserGroupManagementSetupService/teamAdminData";
import {
  SyncUserGroupManagementForAllTeamsResult,
  SyncUserGroupManagementResult,
  SyncUserGroupManagementStatus,
} from "TeamAdmin/Services/UserGroupManagementSetupService/types";
import { filterOutInvalidUserGroupUsers } from "TeamAdmin/Services/UserGroupManagementSetupService/validate";
import { sendUserGroupInvitesToNewUsers } from "TeamAdmin/Services/UserGroupManagementSetupService/sendUserGroupInvitesToNewUsers";
import { TeamAdminSharingData } from "Sharing/2/Services/team-admin-data-sync-helpers";
export function syncUserGroupManagementForAllTeams(
  sharingService: ISharingServices,
  wsService: WSService,
  currentUserInfo: CurrentUserInfo,
  currentSpaceData: SpaceData,
  currentTeamAdminData: TeamAdminData,
  sharingData: TeamAdminSharingData,
  storeService: StoreService
): Promise<SyncUserGroupManagementForAllTeamsResult> {
  const teamAdminData = syncAdministrableTeamList(
    currentTeamAdminData,
    storeService
  );
  return Promise.all(
    Object.keys(teamAdminData.teams).map((teamId) => {
      const adminData = teamAdminData.teams[teamId];
      return syncUserGroupManagementForOneTeam(
        sharingService,
        wsService,
        currentUserInfo,
        currentSpaceData,
        adminData,
        sharingData
      );
    })
  ).then((resultArray) => {
    const teams = {};
    resultArray
      .map((result) => result.adminData)
      .forEach((adminData) => {
        teams[adminData.teamId] = adminData;
      });
    const status = resultArray.some(
      (result) =>
        result.status === SyncUserGroupManagementStatus.NEEDS_FRESH_SHARING_DATA
    )
      ? SyncUserGroupManagementStatus.NEEDS_FRESH_SHARING_DATA
      : SyncUserGroupManagementStatus.COMPLETE;
    return {
      status,
      teamAdminData: { teams },
    };
  });
}
function syncUserGroupManagementForOneTeam(
  sharingServices: ISharingServices,
  wsService: WSService,
  currentUserInfo: CurrentUserInfo,
  currentSpaceData: SpaceData,
  currentAdminData: AdminData,
  sharingData: TeamAdminSharingData
): Promise<SyncUserGroupManagementResult> {
  return Promise.resolve(currentAdminData)
    .then((adminData) =>
      syncAdminData(wsService, currentUserInfo, adminData, sharingData)
    )
    .then((adminData) =>
      setupUserGroupManagement(
        sharingServices,
        currentUserInfo,
        currentSpaceData,
        adminData
      )
    )
    .then((userGroupManagementResult) => {
      if (
        userGroupManagementResult.status ===
        SyncUserGroupManagementStatus.NEEDS_FRESH_SHARING_DATA
      ) {
        return userGroupManagementResult;
      }
      return filterOutInvalidUserGroupUsers(
        sharingServices.crypto,
        userGroupManagementResult.adminData
      )
        .then((adminData) =>
          sendUserGroupInvitesToNewUsers(
            sharingServices,
            currentUserInfo,
            adminData
          )
        )
        .then((adminData) => ({
          status: SyncUserGroupManagementStatus.COMPLETE,
          adminData,
        }));
    });
}
export function getUserGroupKey(
  userGroupAdminItems: UserGroupAdminItem[],
  groupId: string
) {
  if (!userGroupAdminItems) {
    return null;
  }
  const userGroupAdminItem = userGroupAdminItems.find(
    (userGroupAdminItem) => userGroupAdminItem.groupId === groupId
  );
  if (!userGroupAdminItem) {
    return null;
  }
  return userGroupAdminItem.groupKey;
}
