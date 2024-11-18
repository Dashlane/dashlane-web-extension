import {
  UserDownload,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import { AdminData } from "Session/Store/teamAdminData/types";
import { ISharingServices } from "Sharing/2/Services";
import { CurrentUserInfo } from "Session/utils";
import { FindUsersResponse } from "Libs/WS/UserAlias";
import { UserGroupMember } from "Sharing/2/SharingController";
import { sendExceptionLog } from "Logs/Exception/index";
import Debugger from "Logs/Debugger";
import { getUserGroupKey } from "TeamAdmin/Services/UserGroupManagementSetupService";
export function sendUserGroupInvitesToNewUsers(
  services: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  currentAdminData: AdminData
): Promise<AdminData> {
  return Promise.resolve()
    .then(() => getUsersToInviteInAllUserGroups(currentAdminData))
    .then((allUsersToInvite) => {
      if (!allUsersToInvite.length) {
        return currentAdminData;
      }
      return getUsersLoginAndPublicKeys(
        services,
        currentUserInfo,
        allUsersToInvite
      ).then((findUsersResponse) => {
        const userGroupPromises = currentAdminData.userGroups.map(
          (userGroup) => {
            const usersToInvite = getUsersToInviteInUserGroup(userGroup);
            if (!usersToInvite.length) {
              return Promise.resolve(userGroup);
            }
            const userGroupMembers = generateUsersInvitation(
              findUsersResponse,
              usersToInvite
            );
            const userGroupKey = getUserGroupKey(
              currentAdminData.userGroupAdminItems,
              userGroup.groupId
            );
            return services.userGroup
              .makeUpdateMembersWithInviteEvent(
                userGroup.groupId,
                userGroupKey,
                userGroup.revision,
                userGroupMembers
              )
              .then((updateUserGroupMembers) => {
                return services.userGroup.updateUserGroupMembers(
                  currentUserInfo,
                  updateUserGroupMembers
                );
              })
              .then((userGroups) => userGroups[0])
              .catch((error) => {
                const message = `[sendUserGroupInvitesToNewUsers] - Cannot send update event for one user group - groupId: ${userGroup.groupId} - error: ${error}`;
                const augmentedError = new Error(message);
                Debugger.error(augmentedError);
                sendExceptionLog({
                  error: augmentedError,
                });
                return userGroup;
              });
          }
        );
        return Promise.all(userGroupPromises).then((userGroups) => {
          return {
            ...currentAdminData,
            userGroups,
          } as AdminData;
        });
      });
    });
}
function getUsersToInviteInAllUserGroups(
  currentAdminData: AdminData
): UserDownload[] {
  if (!currentAdminData.userGroups) {
    return [];
  }
  return currentAdminData.userGroups.reduce((usersToInvite, userGroup) => {
    return usersToInvite.concat(getUsersToInviteInUserGroup(userGroup));
  }, []);
}
function getUsersToInviteInUserGroup(
  userGroup: UserGroupDownload
): UserDownload[] {
  return userGroup.users.filter((user) => user.rsaStatus === "publicKey");
}
function getUsersLoginAndPublicKeys(
  services: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  usersToInvite: UserDownload[]
): Promise<{
  [login: string]: FindUsersResponse;
}> {
  const { login, uki } = currentUserInfo;
  const aliases = JSON.stringify(usersToInvite.map((user) => user.alias));
  return services.userGroup.findUsersByAliases({
    login,
    uki,
    aliases,
  });
}
function generateUsersInvitation(
  findUsersResponse: any,
  usersToInvite: UserDownload[]
): UserGroupMember[] {
  return usersToInvite.map((user) => ({
    Alias: user.alias,
    Login: findUsersResponse[user.alias].login,
    PublicKey: findUsersResponse[user.alias].publicKey,
    Permission: user.permission,
  }));
}
