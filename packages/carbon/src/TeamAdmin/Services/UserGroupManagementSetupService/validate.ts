import { UserDownload } from "@dashlane/sharing/types/serverResponse";
import { AdminData } from "Session/Store/teamAdminData/types";
import { isProposeSignatureValid } from "Sharing/2/Services/utils";
import { ICryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import { getUserGroupKey } from "TeamAdmin/Services/UserGroupManagementSetupService";
export function filterOutInvalidUserGroupUsers(
  crypto: ICryptoService,
  currentAdminData: AdminData
): Promise<AdminData> {
  if (!currentAdminData.userGroups) {
    return Promise.resolve(currentAdminData);
  }
  const userGroupPromises = currentAdminData.userGroups.map((userGroup) => {
    const groupKey = getUserGroupKey(
      currentAdminData.userGroupAdminItems,
      userGroup.groupId
    );
    return filterOutInvalidUsers(crypto, groupKey, userGroup.users).then(
      (filteredUsers) => {
        return {
          ...userGroup,
          users: filteredUsers,
        };
      }
    );
  });
  return Promise.all(userGroupPromises).then((userGroupsWithFilteredUsers) => {
    return {
      ...currentAdminData,
      userGroups: userGroupsWithFilteredUsers,
    };
  });
}
function filterOutInvalidUsers(
  crypto: ICryptoService,
  groupKey: string | null,
  users: UserDownload[]
): Promise<UserDownload[]> {
  const userValidationPromises: Promise<boolean>[] = users.map((user) => {
    if (user.status === "refused" || user.status === "revoked") {
      return Promise.resolve(true);
    }
    if (!user.proposeSignature) {
      return Promise.resolve(false);
    }
    if (groupKey === null) {
      return Promise.resolve(false);
    }
    const contentToSign = user.proposeSignatureUsingAlias
      ? user.alias
      : user.userId;
    return isProposeSignatureValid(
      crypto,
      user.proposeSignature,
      contentToSign,
      groupKey
    );
  });
  return Promise.all(userValidationPromises).then(
    (userValidationPromiseResults) =>
      users.filter((_user, index) => userValidationPromiseResults[index])
  );
}
