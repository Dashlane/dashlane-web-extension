import { Space } from "@dashlane/communication";
import { Sharing2Summary, SharingData } from "Session/Store/sharingData/types";
import {
  AdminData,
  AdminItem,
  AdminProvisioningKeyItem,
  DirectorySyncKey,
  ESConfigsSpecialItem,
  MassDeploymentTeamKeyItem,
  SCIMSignatureKey,
  SSOConnectorKey,
  TeamAdminData,
  TeamAdminDataDictionary,
  UserGroupAdminItem,
} from "Session/Store/teamAdminData/types";
import { StoreService } from "Store";
import { buildSharingData, getSharedData } from "Sharing/2/SharingController";
import {
  teamAdminDataUpdated,
  userGroupAdminItemCreated,
  userGroupsDeleted,
  userGroupsUpdated,
} from "Session/Store/teamAdminData/actions";
import { sendTeamAdminDataUpdate } from "Session/SessionCommunication";
import { WSService } from "Libs/WS/index";
import {
  decryptAdminItem,
  hasUserAcceptedUserGroup,
  isAdminProvisioningKey,
  isDirectorySyncKey,
  isEsBasicConfigsData,
  isSCIMSignatureKey,
  isSSOConnectorKey,
  isUserGroupAdminItem,
} from "TeamAdmin/Services";
import { isMassDeploymentTeamKey } from "TeamAdmin/Services/LoggedOutMonitoring";
import { makeCryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import { CurrentUserInfo } from "Session/utils";
import {
  ItemGroupDownload,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import { UserGroupDescription } from "@dashlane/sharing/types/userGroup/findTeamGroupsServerResponse";
import {
  getNodePremiumStatusSpaceData,
  hasSpecialUserGroupAccessInSpace,
} from "Store/helpers/spaceData";
import { TeamAdminSharingData } from "Sharing/2/Services/team-admin-data-sync-helpers";
export function getUserGroupDescriptionsForTeam(
  wsService: WSService,
  login: string,
  uki: string,
  teamId: number
): Promise<UserGroupDescription[]> {
  return wsService.teamPlans
    .findUserGroups({
      login,
      uki,
      teamId,
    })
    .then((response) => response.content.userGroups);
}
export function syncAdministrableTeamList(
  storedTeamAdminData: TeamAdminData,
  storeService: StoreService
): TeamAdminData {
  const teams = {};
  const spaceData = getNodePremiumStatusSpaceData(storeService);
  const teamIdsInSpaceData: string[] = spaceData.spaces
    .filter((s: Space) => hasSpecialUserGroupAccessInSpace(s.teamId, spaceData))
    .map((s: Space) => s.teamId);
  Object.keys(storedTeamAdminData.teams)
    .filter((teamId) => Boolean(teamId))
    .filter((teamId) => teamIdsInSpaceData.includes(teamId))
    .forEach((teamId) => {
      teams[teamId] = storedTeamAdminData.teams[teamId];
    });
  teamIdsInSpaceData.forEach((teamId) => {
    if (!teams[teamId]) {
      teams[teamId] = { teamId };
    }
  });
  return { teams };
}
export async function syncAdminData(
  wsService: WSService,
  currentUserInfo: CurrentUserInfo,
  storedAdminData: AdminData,
  sharingData: TeamAdminSharingData
): Promise<AdminData> {
  const adminData = await syncAdminDataFromSharingData(
    currentUserInfo,
    storedAdminData,
    sharingData
  );
  if (
    adminData.specialUserGroup &&
    !hasUserAcceptedUserGroup(currentUserInfo.login, adminData.specialUserGroup)
  ) {
    return adminData;
  }
  return syncUserGroups(
    wsService,
    currentUserInfo.login,
    currentUserInfo.uki,
    adminData
  );
}
export function filterTeamAdminData(
  teamAdminData: TeamAdminData
): TeamAdminData {
  const teams: TeamAdminDataDictionary = {};
  Object.keys(teamAdminData.teams).forEach((teamId: string) => {
    const rawAdminData = teamAdminData.teams[teamId];
    if (!rawAdminData) {
      teams[teamId] = { teamId };
      return;
    }
    teams[teamId] = {
      teamId,
      userGroups: rawAdminData.userGroups || [],
      notifications: rawAdminData.notifications || {
        accountRecoveryRequests: [],
      },
    };
  });
  return { teams };
}
export function updateTeamAdminData(
  storeService: StoreService,
  teamAdminData: TeamAdminData
): void {
  storeService.dispatch(teamAdminDataUpdated(teamAdminData));
  sendTeamAdminDataUpdate(filterTeamAdminData(teamAdminData));
}
export function updateAdministrableUserGroupList(
  storeService: StoreService,
  teamId: string,
  userGroups: UserGroupDownload[]
): void {
  storeService.dispatch(userGroupsUpdated(teamId, userGroups));
  sendTeamAdminDataUpdate(filterTeamAdminData(storeService.getTeamAdminData()));
}
export function deleteAdministrableUserGroups(
  storeService: StoreService,
  teamId: string,
  userGroups: UserGroupDownload[]
): void {
  storeService.dispatch(userGroupsDeleted(teamId, userGroups));
  sendTeamAdminDataUpdate(filterTeamAdminData(storeService.getTeamAdminData()));
}
export function createUserGroupAdminItemInState(
  storeService: StoreService,
  teamId: string,
  userGroupAdminItem: UserGroupAdminItem
): void {
  storeService.dispatch(userGroupAdminItemCreated(teamId, userGroupAdminItem));
}
function syncSpecialGroupsFromSharingData(
  adminData: AdminData,
  sharingData: TeamAdminSharingData
): AdminData {
  const { specialItemGroup, specialUserGroup } = sharingData;
  return {
    ...adminData,
    specialItemGroup,
    specialUserGroup,
  };
}
async function syncUserGroupAdminItemsFromSharingData(
  currentUserInfo: CurrentUserInfo,
  adminData: AdminData,
  sharingData: TeamAdminSharingData
): Promise<AdminData> {
  const crypto = makeCryptoService();
  const { specialItemGroup, specialItems } = sharingData;
  const adminItems = await Promise.all(
    specialItemGroup?.items?.map(({ itemId, itemKey }) => {
      const item = specialItems[itemId];
      if (!item) {
        throw new Error("Unexpected error: missing itemKey");
      }
      return decryptAdminItem(
        crypto,
        currentUserInfo,
        adminData,
        item,
        itemKey
      );
    }) ?? []
  );
  const {
    userGroupAdminItems,
    directorySyncKey,
    encryptionServiceData,
    ssoConnectorKey,
    scimSignatureKey,
    adminProvisioningKey,
    massDeploymentTeamKey,
  } = partitionAdminItems(adminItems);
  return {
    ...adminData,
    userGroupAdminItems,
    directorySyncKey,
    encryptionServiceData,
    ssoConnectorKey,
    scimSignatureKey,
    adminProvisioningKey,
    massDeploymentTeamKey,
  };
}
type PartitionedAdminItems = {
  userGroupAdminItems: UserGroupAdminItem[];
  directorySyncKey: DirectorySyncKey | null;
  encryptionServiceData: ESConfigsSpecialItem | null;
  ssoConnectorKey: SSOConnectorKey | null;
  scimSignatureKey: SCIMSignatureKey | null;
  adminProvisioningKey: AdminProvisioningKeyItem | null;
  massDeploymentTeamKey: MassDeploymentTeamKeyItem | null;
};
const partitionAdminItems = (adminItems: AdminItem[]): PartitionedAdminItems =>
  adminItems.reduce<PartitionedAdminItems>(
    (partitionedAdminItems, adminItem) => {
      if (isUserGroupAdminItem(adminItem)) {
        partitionedAdminItems.userGroupAdminItems.push(adminItem);
      } else if (isDirectorySyncKey(adminItem)) {
        partitionedAdminItems.directorySyncKey = adminItem;
      } else if (isEsBasicConfigsData(adminItem)) {
        partitionedAdminItems.encryptionServiceData = adminItem;
      } else if (isSSOConnectorKey(adminItem)) {
        partitionedAdminItems.ssoConnectorKey = adminItem;
      } else if (isSCIMSignatureKey(adminItem)) {
        partitionedAdminItems.scimSignatureKey = adminItem;
      } else if (isAdminProvisioningKey(adminItem)) {
        partitionedAdminItems.adminProvisioningKey = adminItem;
      } else if (isMassDeploymentTeamKey(adminItem)) {
        partitionedAdminItems.massDeploymentTeamKey = adminItem;
      }
      return partitionedAdminItems;
    },
    {
      userGroupAdminItems: [],
      directorySyncKey: null,
      encryptionServiceData: null,
      ssoConnectorKey: null,
      scimSignatureKey: null,
      adminProvisioningKey: null,
      massDeploymentTeamKey: null,
    }
  );
export async function syncAdminDataFromSharingData(
  currentUserInfo: CurrentUserInfo,
  storedAdminData: AdminData,
  sharingData: TeamAdminSharingData
): Promise<AdminData> {
  const adminData = syncSpecialGroupsFromSharingData(
    storedAdminData,
    sharingData
  );
  return syncUserGroupAdminItemsFromSharingData(
    currentUserInfo,
    adminData,
    sharingData
  );
}
async function syncUserGroups(
  wsService: WSService,
  login: string,
  uki: string,
  adminData: AdminData
): Promise<AdminData & Required<Pick<AdminData, "userGroups">>> {
  const descriptions = await getUserGroupDescriptionsForTeam(
    wsService,
    login,
    uki,
    Number(adminData.teamId)
  );
  const summary: Sharing2Summary = {
    items: [],
    itemGroups: [],
    userGroups: descriptions.map((d) => ({
      id: d.groupId,
      revision: d.revision,
    })),
  };
  const currentData: SharingData = {
    items: [],
    itemGroups: [],
    userGroups: (adminData.userGroups || []).filter((g) => Boolean(g)),
  };
  const sharingData = await buildSharingData(
    wsService,
    login,
    uki,
    summary,
    currentData
  );
  return {
    ...adminData,
    userGroups: sharingData.userGroups,
  };
}
export async function loadSpecialItemGroup(
  wsService: WSService,
  login: string,
  uki: string,
  adminData: AdminData
): Promise<ItemGroupDownload> {
  if (!adminData.specialItemGroup || !adminData.specialItemGroup.groupId) {
    throw new Error("specialItemGroup is missing from adminData");
  }
  const { itemGroups } = await getSharedData(wsService, login, uki, {
    itemIds: [],
    itemGroupIds: [adminData.specialItemGroup.groupId],
    userGroupIds: [],
  });
  if (itemGroups && itemGroups.length === 1) {
    return itemGroups[0];
  }
  throw new Error("could not fetch specialItemGroup");
}
export async function loadSpecialUserGroup(
  wsService: WSService,
  login: string,
  uki: string,
  adminData: AdminData
): Promise<UserGroupDownload> {
  const { userGroups } = await getSharedData(wsService, login, uki, {
    itemIds: [],
    itemGroupIds: [],
    userGroupIds: adminData.specialUserGroup?.groupId
      ? [adminData.specialUserGroup.groupId]
      : [],
  });
  if (userGroups && userGroups.length === 1) {
    return userGroups[0];
  }
  throw new Error("Could not fetch specialUserGroup");
}
