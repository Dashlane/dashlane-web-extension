import { drop, isEmpty, prepend, take } from "ramda";
import { GetTeamMembersBodyData } from "@dashlane/server-sdk/v1";
import {
  AddTeamAdminRequest,
  AddTeamAdminResult,
  GetSpecialUserGroupInviteValuesRequest,
  GetSpecialUserGroupInviteValuesResult,
  GetSpecialUserGroupRevisionRequest,
  GetSpecialUserGroupRevisionResult,
  GetTeamMembersRequest,
  GetTeamMembersResult,
  RemoveTeamAdminRequest,
  RemoveTeamAdminResult,
  TeamMemberInfo,
} from "@dashlane/communication";
import { CurrentUserInfo, getCurrentUserInfo } from "Session/utils";
import { makeCryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import {
  getAdminDataFromTeamAdminData,
  makeInviteToSpecialUserGroup,
} from "TeamAdmin/Services";
import { WSService } from "Libs/WS/index";
import { loadSpecialUserGroup } from "TeamAdmin/Services/UserGroupManagementSetupService/teamAdminData";
import { ISharingServices, makeSharingService } from "Sharing/2/Services";
import { getTeamMembers } from "Libs/DashlaneApi/services/teams/members/get-team-members";
import { isApiError } from "Libs/DashlaneApi";
import { StoreService } from "Store";
import { CoreServices } from "Services";
const groupsOf = <T>(n: number, list: T[]): T[][] =>
  isEmpty(list) ? [] : prepend(take(n, list), groupsOf(n, drop(n, list)));
const processMember = (
  memberFromServer: GetTeamMembersBodyData["members"][number]
): TeamMemberInfo => {
  const hasCoherentData =
    memberFromServer.nbrPasswords && memberFromServer.status !== "removed";
  return {
    ...memberFromServer,
    compromisedPasswords: memberFromServer.compromisedPasswords ?? 0,
    securityIndex:
      memberFromServer.status !== "removed" && memberFromServer.securityIndex,
    nbrPasswords: hasCoherentData && memberFromServer.nbrPasswords,
    ...(memberFromServer.status === "pending" &&
    memberFromServer.lastUpdateDateUnix
      ? {}
      : { lastUpdateDateUnix: memberFromServer.lastUpdateDateUnix }),
  };
};
export async function getMembers(
  storeService: StoreService,
  login: string,
  { teamId }: GetTeamMembersRequest
): Promise<GetTeamMembersResult> {
  const response = await getTeamMembers(storeService, login, {
    teamId,
    orderBy: "login",
    limit: 0,
  });
  if (isApiError(response)) {
    const error = new Error(response.message);
    return {
      success: false,
      error,
    };
  }
  const updatedMembers = response.members.map(processMember);
  return {
    success: true,
    members: updatedMembers,
  };
}
export interface ProposeMembersRequest {
  teamId: number;
  proposedMemberLogins: string[];
  origin?: string;
  notificationOptions?:
    | {
        skipAccountCreationRequiredAlerts: true;
      }
    | {
        skipAccountCreationRequiredAlerts: false;
      };
}
export interface ProposeMembersResult {
  accountCreationRequiredMembers: string[];
  proposedMembers: {
    [login: string]: boolean;
  };
  refusedMembers: {
    [login: string]: string;
  };
}
export async function proposeMembers(
  wsService: WSService,
  { login, uki }: CurrentUserInfo,
  {
    proposedMemberLogins,
    teamId,
    origin,
    notificationOptions = { skipAccountCreationRequiredAlerts: false },
  }: ProposeMembersRequest
): Promise<ProposeMembersResult> {
  const { content } = await wsService.teamPlans.proposeMembers({
    login,
    uki,
    teamId,
    proposedMemberLogins,
    force: true,
    origin,
    notificationOptions,
  });
  return content;
}
export async function addTeamAdmin(
  sharingService: ISharingServices,
  { teamId, memberLogin }: AddTeamAdminRequest
): Promise<AddTeamAdminResult> {
  const { ws: wsService, store: storeService } = sharingService;
  const currentUserInfo = getCurrentUserInfo(storeService);
  const currentTeamAdminData = storeService.getTeamAdminData();
  const adminData = getAdminDataFromTeamAdminData(
    currentTeamAdminData,
    String(teamId)
  );
  const { revision: recentRevision } = await loadSpecialUserGroup(
    wsService,
    currentUserInfo.login,
    currentUserInfo.uki,
    adminData
  );
  const { groupKey, proposeSignature } = await makeInviteToSpecialUserGroup(
    sharingService,
    makeCryptoService(),
    currentUserInfo,
    currentTeamAdminData,
    {
      teamId,
      memberLogin,
    }
  );
  await sharingService.ws.teamPlans.addTeamAdmin({
    login: currentUserInfo.login,
    uki: currentUserInfo.uki,
    teamId,
    memberLogin,
    memberAlias: memberLogin,
    groupKey,
    proposeSignature,
    userGroupRevision: recentRevision,
  });
  return {};
}
export async function removeTeamAdmin(
  sharingService: ISharingServices,
  { teamId, memberLogin }: RemoveTeamAdminRequest
): Promise<RemoveTeamAdminResult> {
  const { ws: wsService, store: storeService } = sharingService;
  const currentUserInfo = getCurrentUserInfo(storeService);
  const currentTeamAdminData = storeService.getTeamAdminData();
  const adminData = getAdminDataFromTeamAdminData(
    currentTeamAdminData,
    String(teamId)
  );
  const { revision: userGroupRevision } = await loadSpecialUserGroup(
    wsService,
    currentUserInfo.login,
    currentUserInfo.uki,
    adminData
  );
  await wsService.teamPlans.removeTeamAdmin({
    login: currentUserInfo.login,
    uki: currentUserInfo.uki,
    teamId,
    memberLogin,
    userGroupRevision,
  });
  return {};
}
export async function getSpecialUserGroupInviteValuesForMemberInTeam(
  coreServices: CoreServices,
  { teamId, memberLogin }: GetSpecialUserGroupInviteValuesRequest
): Promise<GetSpecialUserGroupInviteValuesResult> {
  const { wsService, storeService } = coreServices;
  const sharingService = makeSharingService(storeService, wsService);
  const currentUserInfo = getCurrentUserInfo(storeService);
  const currentTeamAdminData = storeService.getTeamAdminData();
  const { groupKey, proposeSignature } = await makeInviteToSpecialUserGroup(
    sharingService,
    makeCryptoService(),
    currentUserInfo,
    currentTeamAdminData,
    {
      teamId,
      memberLogin,
    }
  );
  return { groupKey, proposeSignature };
}
export async function getSpecialUserGroupRevision(
  coreServices: CoreServices,
  { teamId }: GetSpecialUserGroupRevisionRequest
): Promise<GetSpecialUserGroupRevisionResult> {
  const { wsService, storeService } = coreServices;
  const currentUserInfo = getCurrentUserInfo(storeService);
  const currentTeamAdminData = storeService.getTeamAdminData();
  const adminData = getAdminDataFromTeamAdminData(
    currentTeamAdminData,
    String(teamId)
  );
  const { revision: specialUserGroupRevision } = await loadSpecialUserGroup(
    wsService,
    currentUserInfo.login,
    currentUserInfo.uki,
    adminData
  );
  return { specialUserGroupRevision };
}
