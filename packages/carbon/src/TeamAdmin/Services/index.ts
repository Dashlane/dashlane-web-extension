import {
  ItemContent,
  ItemGroupDownload,
  UserDownload,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import { AddTeamAdminRequest, Member } from "@dashlane/communication";
import { extractAliasesFromMembers } from "Sharing/2/SharingController";
import { CurrentUserInfo, getCurrentUserInfo } from "Session/utils";
import {
  AdminData,
  AdminItem,
  AdminProvisioningKeyItem,
  DirectorySyncKey,
  ESConfigsSpecialItem,
  SCIMSignatureKey,
  SSOConnectorKey,
  TeamAdminData,
  UserGroupAdminItem,
} from "Session/Store/teamAdminData/types";
import { ICryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import { generateProposeSignature } from "Sharing/2/Services/utils";
import { decryptGroupKey } from "Sharing/2/Services/UserGroupService";
import { WSService } from "Libs/WS/index";
import { FindUsersResponse } from "Libs/WS/UserAlias";
import { StoreService } from "Store/index";
import { syncUserGroupManagementForAllTeams } from "TeamAdmin/Services/UserGroupManagementSetupService";
import { updateTeamAdminData } from "TeamAdmin/Services/UserGroupManagementSetupService/teamAdminData";
import { ISharingServices, makeSharingService } from "Sharing/2/Services/index";
import { SyncUserGroupManagementStatus } from "TeamAdmin/Services/UserGroupManagementSetupService/types";
import { TeamAdminSharingData } from "Sharing/2/Services/team-admin-data-sync-helpers";
export function getSpecialUserGroup(
  adminData: AdminData
): UserGroupDownload | null {
  return adminData.specialUserGroup;
}
export function getUserInUserGroup(
  userId: string,
  userGroup: UserGroupDownload
): UserDownload {
  return userGroup.users.find((user) => user.userId === userId);
}
export function hasUserAcceptedUserGroup(
  userId: string,
  userGroup: UserGroupDownload
): boolean {
  return userGroup.users.some(
    (user) => user.userId === userId && user.status === "accepted"
  );
}
export function getSpecialUserGroupKey(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  adminData: AdminData
): PromiseLike<string> {
  const specialUserGroup = getSpecialUserGroup(adminData);
  if (!specialUserGroup) {
    throw new Error("specialUserGroup is not available in adminData");
  }
  const selfInSpecialUserGroup = specialUserGroup.users.find(
    (user) => user.userId === currentUserInfo.login
  );
  if (!selfInSpecialUserGroup) {
    throw new Error("couldnt find self in specialUserGroup users");
  }
  return decryptGroupKey(
    crypto,
    currentUserInfo,
    selfInSpecialUserGroup.groupKey
  );
}
export async function getSpecialUserGroupPrivateKey(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  adminData: AdminData
): Promise<string> {
  const specialUserGroupKey = await getSpecialUserGroupKey(
    crypto,
    currentUserInfo,
    adminData
  );
  const specialUserGroup = getSpecialUserGroup(adminData);
  return await crypto.symmetricEncryption.decryptAES256(
    specialUserGroupKey,
    specialUserGroup.privateKey
  );
}
export function encryptGroupKeyForUser(
  crypto: ICryptoService,
  userPublicKey: string,
  groupKey: string
): PromiseLike<string> {
  return crypto.asymmetricEncryption.encrypt(userPublicKey, groupKey);
}
export function getPublicKeyForUser(
  sharingService: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  userAlias: string
): PromiseLike<string> {
  return sharingService.userGroup
    .findExistingUsersByAliases({
      login: currentUserInfo.login,
      uki: currentUserInfo.uki,
      aliases: extractAliasesFromMembers([{ Alias: userAlias } as Member]),
    })
    .then((findUserServiceResponse: { [key: string]: FindUsersResponse }) => {
      return findUserServiceResponse[userAlias].publicKey;
    });
}
export function makeInviteToSpecialUserGroup(
  sharingService: ISharingServices,
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  currentTeamAdminData: TeamAdminData,
  {
    teamId,
    memberLogin,
    publicKey,
  }: AddTeamAdminRequest & {
    publicKey?: string;
  }
) {
  const adminData = getAdminDataFromTeamAdminData(
    currentTeamAdminData,
    String(teamId)
  );
  const publicKeyPromise: PromiseLike<string> = publicKey
    ? Promise.resolve(publicKey)
    : getPublicKeyForUser(sharingService, currentUserInfo, memberLogin);
  return Promise.all([
    getSpecialUserGroupKey(crypto, currentUserInfo, adminData),
    publicKeyPromise,
  ])
    .then(([specialUserGroupKey, promotedAdminPublicKey]) =>
      Promise.all([
        encryptGroupKeyForUser(
          crypto,
          promotedAdminPublicKey,
          specialUserGroupKey
        ),
        generateProposeSignature(crypto, specialUserGroupKey, memberLogin),
      ])
    )
    .then(([groupKey, proposeSignature]) => ({
      groupKey,
      proposeSignature,
      userGroupRevision: getSpecialUserGroup(adminData).revision,
    }));
}
export function getAdminDataFromTeamAdminData(
  teamAdminData: TeamAdminData,
  teamId: string | number
): AdminData | null {
  return teamAdminData.teams[teamId];
}
export function getSpecialItemGroupFromAdminData(
  adminData: AdminData
): ItemGroupDownload | null {
  return adminData.specialItemGroup;
}
export async function getSpecialItemGroupKey(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  adminData: AdminData
) {
  const specialItemGroup = getSpecialItemGroupFromAdminData(adminData);
  if (!specialItemGroup) {
    throw new Error("specialItemGroup is not available in adminData");
  }
  const privateKeyForSpecialUserGroup = await getSpecialUserGroupPrivateKey(
    crypto,
    currentUserInfo,
    adminData
  );
  const specialUserGroupId = getSpecialUserGroup(adminData).groupId;
  const specialUserGroupInSpecialItemGroup = specialItemGroup.groups.find(
    (group) => group.groupId === specialUserGroupId
  );
  if (!specialUserGroupInSpecialItemGroup) {
    throw new Error("couldnt find specialUserGroup in specialItemGroup groups");
  }
  return crypto.asymmetricEncryption.decrypt(
    privateKeyForSpecialUserGroup,
    specialUserGroupInSpecialItemGroup.groupKey
  );
}
export function getUserGroupAdminItem(
  currentTeamAdminData: TeamAdminData,
  teamId: string,
  groupId: string
): UserGroupAdminItem {
  const adminData = getAdminDataFromTeamAdminData(currentTeamAdminData, teamId);
  const userGroupAdminItems = adminData.userGroupAdminItems || [];
  return userGroupAdminItems.find(
    (userGroupAdminItem) => userGroupAdminItem.groupId === groupId
  );
}
export function getUserGroup(
  currentTeamAdminData: TeamAdminData,
  groupId: string
): UserGroupDownload {
  const allUserGroups = Object.keys(currentTeamAdminData.teams)
    .map(
      (teamId) =>
        currentTeamAdminData.teams[teamId] &&
        currentTeamAdminData.teams[teamId].userGroups
    )
    .reduce(
      (accumulator, currentValue) => currentValue.concat(accumulator),
      []
    );
  return allUserGroups.find((userGroup) => userGroup.groupId === groupId);
}
export async function decryptAdminItem(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  adminData: AdminData,
  item: ItemContent,
  encryptedItemKey: string
): Promise<AdminItem> {
  const specialItemGroupKey = await getSpecialItemGroupKey(
    crypto,
    currentUserInfo,
    adminData
  );
  const decryptedItemKey = await crypto.symmetricEncryption.decryptAES256(
    specialItemGroupKey,
    encryptedItemKey
  );
  const content = await crypto.symmetricEncryption.decryptAES256(
    decryptedItemKey,
    item.content
  );
  return {
    ...JSON.parse(content),
    itemId: item.itemId,
  };
}
export function isUserGroupAdminItem(
  adminItem: AdminItem
): adminItem is UserGroupAdminItem {
  return "groupId" in adminItem;
}
export function isDirectorySyncKey(
  adminItem: AdminItem
): adminItem is DirectorySyncKey {
  return "publicKey" in adminItem;
}
export const isEsBasicConfigsData = (
  adminItem: AdminItem
): adminItem is ESConfigsSpecialItem => "basicConfigs" in adminItem;
export const isSSOConnectorKey = (
  adminItem: AdminItem
): adminItem is SSOConnectorKey => "ssoConnectorKey" in adminItem;
export const isSCIMSignatureKey = (
  adminItem: AdminItem
): adminItem is SCIMSignatureKey => "scimSignatureKey" in adminItem;
export const isAdminProvisioningKey = (
  adminItem: AdminItem
): adminItem is AdminProvisioningKeyItem => "adminProvisioningKey" in adminItem;
export function syncUserGroupManagement(
  storeService: StoreService,
  wsService: WSService,
  sharingData: TeamAdminSharingData
): Promise<SyncUserGroupManagementStatus> {
  const currentSpaceData = storeService.getSpaceData();
  const currentTeamAdminData = storeService.getTeamAdminData();
  const currentUserInfo = getCurrentUserInfo(storeService);
  const sharingService = makeSharingService(storeService, wsService);
  if (!currentUserInfo.privateKey) {
    return Promise.reject(new Error("PRIVATE_KEY_MISSING"));
  }
  return syncUserGroupManagementForAllTeams(
    sharingService,
    wsService,
    getCurrentUserInfo(storeService),
    currentSpaceData,
    currentTeamAdminData,
    sharingData,
    storeService
  ).then((result) => {
    updateTeamAdminData(storeService, result.teamAdminData);
    return result.status;
  });
}
export function findTeamForGroup(
  teamAdminData: TeamAdminData,
  groupId: string
): AdminData {
  const currentTeamId = Object.keys(teamAdminData.teams).find((teamId) =>
    teamAdminData.teams[teamId].userGroups.some(
      (userGroup) => userGroup.groupId === groupId
    )
  );
  return (
    currentTeamId &&
    teamAdminData &&
    teamAdminData.teams &&
    teamAdminData.teams[currentTeamId]
  );
}
