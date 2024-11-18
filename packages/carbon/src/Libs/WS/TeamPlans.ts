import { TeamMemberInfo } from "@dashlane/communication";
import { FindTeamGroupsServerResponse } from "@dashlane/sharing/types/userGroup/findTeamGroupsServerResponse";
import { _makeRequest } from "Libs/WS/request";
const WSVERSION = 1;
const WSNAME = "teamPlans";
export interface WSTeamPlans {
  findUserGroups: (params: BaseParams) => Promise<FindUserGroupsResponse>;
  proposeMembers: (
    params: ProposeMembersParams
  ) => Promise<ProposeMembersResponse>;
  acceptTeam: (params: AcceptTeamParams) => Promise<BaseResponse>;
  addTeamAdmin: (params: AddTeamAdminParams) => Promise<BaseResponse>;
  removeTeamAdmin: (params: RemoveTeamAdminParams) => Promise<BaseResponse>;
  registerFreeTrial: (params: RegisterFreeTrialParams) => Promise<{}>;
  confirmFreeTrial: (params: ConfirmFreeTrialParams) => Promise<{}>;
  getDirectorySyncRequest: (
    params: BaseParams
  ) => Promise<GetDirectorySyncRequestResponse>;
  updateDirectorySyncRequestStatus: (
    params: UpdateDirectorySyncRequestStatusParams
  ) => Promise<BaseResponse>;
  spaceDeleted: (params: BaseParams) => Promise<BaseResponse>;
}
export const makeWSTeamPlans = () => {
  return {
    findUserGroups: (params: BaseParams) => findUserGroups(params),
    proposeMembers: (params: ProposeMembersParams) => proposeMembers(params),
    acceptTeam: (params: AcceptTeamParams) => acceptTeam(params),
    addTeamAdmin: (params: AddTeamAdminParams) => addTeamAdmin(params),
    removeTeamAdmin: (params: RemoveTeamAdminParams) => removeTeamAdmin(params),
    registerFreeTrial: (params: RegisterFreeTrialParams) =>
      registerFreeTrial(params),
    confirmFreeTrial: (params: ConfirmFreeTrialParams) =>
      confirmFreeTrial(params),
    getDirectorySyncRequest: (params: BaseParams) =>
      getDirectorySyncRequest(params),
    updateDirectorySyncRequestStatus: (
      params: UpdateDirectorySyncRequestStatusParams
    ) => updateDirectorySyncRequestStatus(params),
    spaceDeleted: (params: BaseParams) => spaceDeleted(params),
  };
};
export interface BaseParams {
  login: string;
  uki: string;
  teamId: number;
}
export interface BaseResponse {
  code: number;
  message: string;
}
export interface FindUserGroupsResponse extends BaseResponse {
  content: FindTeamGroupsServerResponse;
}
function findUserGroups(params: BaseParams) {
  return _makeRequest<FindUserGroupsResponse, BaseParams>(
    WSNAME,
    WSVERSION,
    "findUserGroups",
    params
  );
}
export interface AddTeamAdminParams extends BaseParams {
  memberLogin: string;
  memberAlias?: string;
  groupKey?: string;
  proposeSignature?: string;
  userGroupRevision?: number;
}
function addTeamAdmin(params: AddTeamAdminParams) {
  return _makeRequest<BaseResponse, AddTeamAdminParams>(
    WSNAME,
    WSVERSION,
    "addTeamCaptain",
    params
  );
}
export interface RemoveTeamAdminParams extends BaseParams {
  memberLogin: string;
  userGroupRevision?: number;
}
function removeTeamAdmin(params: RemoveTeamAdminParams) {
  return _makeRequest<BaseResponse, RemoveTeamAdminParams>(
    WSNAME,
    WSVERSION,
    "removeTeamCaptain",
    params
  );
}
export interface GetMembersParams extends BaseParams {
  limit: number;
  orderBy: string;
}
export interface GetMembersResponse extends BaseResponse {
  content: {
    billingAdmins: string[];
    members: TeamMemberInfo[];
    page: number;
    pages: number;
  };
}
export interface ProposeMembersParams extends BaseParams {
  proposedMemberLogins: string[];
  force: boolean;
  origin?: string;
  notificationOptions?: {
    skipAccountCreationRequiredAlerts?: boolean;
    skipReproposals?: boolean;
  };
}
export interface ProposeMembersResponse extends BaseResponse {
  content: {
    accountCreationRequiredMembers: string[];
    proposedMembers: {
      [login: string]: boolean;
    };
    refusedMembers: {
      [login: string]: string;
    };
  };
}
function proposeMembers(params: ProposeMembersParams) {
  return _makeRequest<ProposeMembersResponse, ProposeMembersParams>(
    WSNAME,
    WSVERSION,
    "proposeMembers",
    params
  );
}
export interface AcceptTeamParams {
  token: string;
}
function acceptTeam(params: AcceptTeamParams) {
  return _makeRequest<BaseResponse, AcceptTeamParams>(
    WSNAME,
    WSVERSION,
    "acceptTeam",
    params
  );
}
export interface RegisterFreeTrialParams {
  creatorEmail: string;
  companyName: string;
  language: string;
}
function registerFreeTrial(params: RegisterFreeTrialParams) {
  return _makeRequest<{}, RegisterFreeTrialParams>(
    WSNAME,
    WSVERSION,
    "registerFreeTrial",
    params
  );
}
export interface ConfirmFreeTrialParams {
  token: string;
}
function confirmFreeTrial(params: ConfirmFreeTrialParams) {
  return _makeRequest<{}, ConfirmFreeTrialParams>(
    WSNAME,
    WSVERSION,
    "confirmFreeTrial",
    params
  );
}
export interface DirectorySyncUserGroup {
  groupId: string;
  groupName: string;
  memberLogins: string[];
}
export interface GetDirectorySyncRequestServerResponse {
  id: number;
  signature: string;
  userGroups: DirectorySyncUserGroup[];
  publicKey: {
    modulus: string;
    exponent: string;
  };
}
export interface GetDirectorySyncRequestResponse extends BaseResponse {
  content: GetDirectorySyncRequestServerResponse;
}
function getDirectorySyncRequest(params: BaseParams) {
  return _makeRequest<GetDirectorySyncRequestResponse, BaseParams>(
    WSNAME,
    WSVERSION,
    "getDirectorySyncRequest",
    params
  );
}
export interface UpdateDirectorySyncRequestStatusParams extends BaseParams {
  teamId: number;
  requestId: number;
  syncError?: string;
}
function updateDirectorySyncRequestStatus(
  params: UpdateDirectorySyncRequestStatusParams
) {
  return _makeRequest<BaseResponse, UpdateDirectorySyncRequestStatusParams>(
    WSNAME,
    WSVERSION,
    "updateDirectorySyncRequestStatus",
    params
  );
}
function spaceDeleted(params: BaseParams) {
  return _makeRequest<BaseResponse, BaseParams>(
    WSNAME,
    WSVERSION,
    "spaceDeleted",
    params
  );
}
