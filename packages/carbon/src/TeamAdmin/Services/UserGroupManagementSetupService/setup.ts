import { Debugger } from "Logs/Debugger";
import { CurrentUserInfo } from "Session/utils";
import { SpaceData } from "Session/Store/spaceData/types";
import { AdminData } from "Session/Store/teamAdminData/types";
import {
  createSpecialItemGroup,
  createSpecialUserGroup,
} from "Sharing/2/SharingController";
import { ISharingServices } from "Sharing/2/Services";
import { getUserInUserGroup } from "TeamAdmin/Services/";
import { getUserGroupAdminItemsFromMigration } from "TeamAdmin/Services/UserGroupManagementSetupService/migrate";
import {
  SyncUserGroupManagementResult,
  SyncUserGroupManagementStatus,
} from "TeamAdmin/Services/UserGroupManagementSetupService/types";
export function setupUserGroupManagement(
  sharingServices: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  currentSpaceData: SpaceData,
  currentAdminData: AdminData
): Promise<SyncUserGroupManagementResult> {
  const specialUserGroup = currentAdminData.specialUserGroup;
  const specialItemGroup = currentAdminData.specialItemGroup;
  if (!specialUserGroup) {
    if (specialItemGroup) {
      return Promise.reject(
        new Error(
          "UserGroupManagementSetupService - no special user group, but a special item group is present"
        )
      );
    }
    return createSpecialGroups(
      sharingServices,
      currentUserInfo,
      currentSpaceData,
      currentAdminData
    ).then((adminData) => ({
      status: SyncUserGroupManagementStatus.COMPLETE,
      adminData,
    }));
  }
  const currentUserInSpecialUserGroup = getUserInUserGroup(
    currentUserInfo.login,
    specialUserGroup
  );
  if (!currentUserInSpecialUserGroup) {
    return Promise.reject(
      new Error(
        "UserGroupManagementSetupService - Current user us missing from special user group"
      )
    );
  }
  if (currentUserInSpecialUserGroup.status === "pending") {
    if (specialItemGroup) {
      return Promise.reject(
        new Error(
          "UserGroupManagementSetupService - special user group is not accepted, but a special item group is present"
        )
      );
    }
    return Promise.resolve()
      .then(() =>
        sharingServices.userGroup.isCurrentUserProposeSignatureValid(
          currentUserInfo,
          specialUserGroup
        )
      )
      .then((valid) => {
        if (!valid) {
          throw new Error(
            "UserGroupManagementSetupService - INVALID_PROPOSE_SIGNATURE"
          );
        }
      })
      .then(() =>
        sharingServices.userGroup.makeAcceptUserGroupEvent(
          currentUserInfo,
          specialUserGroup
        )
      )
      .then((acceptUserGroupEvent) =>
        sharingServices.userGroup.acceptUserGroup(
          currentUserInfo,
          acceptUserGroupEvent
        )
      )
      .then(({ userGroups }) => {
        if (userGroups.length !== 1) {
          throw new Error(
            `UserGroupManagementSetupService - Invalid response from UserGroupService.acceptUserGroup - ${userGroups}`
          );
        }
        return userGroups[0];
      })
      .then((specialUserGroup) =>
        Object.assign({}, currentAdminData, { specialUserGroup })
      )
      .then((adminData) => ({
        status: SyncUserGroupManagementStatus.NEEDS_FRESH_SHARING_DATA,
        adminData,
      }));
  }
  if (currentUserInSpecialUserGroup.status === "accepted") {
    if (!specialItemGroup) {
      return createSpecialGroups(
        sharingServices,
        currentUserInfo,
        currentSpaceData,
        currentAdminData
      ).then((adminData) => ({
        status: SyncUserGroupManagementStatus.COMPLETE,
        adminData,
      }));
    }
    return Promise.resolve({
      status: SyncUserGroupManagementStatus.COMPLETE,
      adminData: currentAdminData,
    });
  }
  return Promise.reject(
    new Error(
      "UserGroupManagementSetupService - current user status in special user group is neither accepted or pending"
    )
  );
}
export function createSpecialGroups(
  sharingServices: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  currentSpaceData: SpaceData,
  currentAdminData: AdminData
): Promise<AdminData> {
  Debugger.log("setting up group sharing for team: " + currentAdminData.teamId);
  return Promise.resolve(currentAdminData)
    .then((adminData) => {
      if (adminData.specialUserGroup) {
        return adminData;
      }
      return createSpecialUserGroup(
        sharingServices,
        currentUserInfo,
        currentSpaceData,
        Number(adminData.teamId)
      ).then(
        (specialUserGroup) =>
          Object.assign({}, adminData, {
            specialUserGroup,
          }) as AdminData
      );
    })
    .then((adminData) => {
      if (adminData.specialItemGroup) {
        return adminData;
      }
      return getUserGroupAdminItemsFromMigration(
        sharingServices.crypto,
        currentUserInfo,
        currentAdminData
      ).then((userGroupAdminItems) => {
        return createSpecialItemGroup(
          sharingServices,
          currentUserInfo,
          adminData.specialUserGroup,
          userGroupAdminItems
        ).then(
          (specialItemGroup) =>
            Object.assign({}, adminData, {
              specialItemGroup,
              userGroupAdminItems,
            }) as AdminData
        );
      });
    });
}
