import {
  CreateUserGroupRequest,
  CreateUserGroupResult,
  DeleteUserGroupRequest,
  DeleteUserGroupResult,
  InviteUserGroupMembersRequest,
  InviteUserGroupMembersResult,
  MemberPermission,
  RenameUserGroupRequest,
  RenameUserGroupResult,
  RevokeUserGroupMembersRequest,
  RevokeUserGroupMembersResult,
  UserInvite,
} from "@dashlane/communication";
import {
  ItemGroupDownload,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import { AddItems as AddItemsEvent } from "@dashlane/sharing/types/addItems";
import { SpaceData } from "Session/Store/spaceData/index";
import { WSService } from "Libs/WS/index";
import { StoreService } from "Store";
import {
  DirectorySyncUserGroup,
  GetDirectorySyncRequestResponse,
} from "Libs/WS/TeamPlans";
import { specialItemGroupUpdated } from "Session/Store/teamAdminData/actions";
import {
  teamDirectorySyncInProgress,
  teamDirectorySyncNotInProgress,
} from "Session/Store/directorySync/actions";
import { isTeamDirectorySyncInProgress } from "Session/Store/directorySync";
import { makeTeamAdminController } from "TeamAdmin/TeamAdminController";
import { SessionService } from "User/Services/types";
import { makeAsymmetricEncryption } from "Libs/CryptoCenter/SharingCryptoService";
import Debugger from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { getSpecialItemGroupKey } from "TeamAdmin/Services";
import { generateItemUuid } from "Utils/generateItemUuid";
import { AdminData } from "Session/Store/teamAdminData/types";
import { CurrentUserInfo } from "Session/utils";
import { ISharingServices } from "Sharing/2/Services";
import leeloo from "Connector/CarbonLeelooConnector";
import { JsonWebPublicKey } from "Libs/CryptoCenter";
import { ItemGroupResponse } from "Libs/WS/Sharing/2/PerformItemGroupAction";
import { loadSpecialItemGroup } from "TeamAdmin/Services/UserGroupManagementSetupService/teamAdminData";
import { ukiSelector } from "Authentication/selectors";
import { Trigger } from "@dashlane/hermes";
const base64 = require("base-64");
export async function saveDirectorySyncKey(
  sharingService: ISharingServices,
  storeService: StoreService,
  sessionService: SessionService,
  currentUserInfo: CurrentUserInfo,
  adminData: AdminData,
  teamId: string,
  publicKey: string
): Promise<void> {
  return addKey().catch(handleSharingError);
  function addKey(): Promise<void> {
    return shareDirectorySyncKey().then(() => {
      sessionService.getInstance().user.attemptSync(Trigger.SettingsChange);
    });
  }
  async function shareDirectorySyncKey(): Promise<ItemGroupResponse> {
    const addItemsEvent = await makeAddItemsEvent();
    return sharingService.item.addItems(
      sharingService.ws,
      currentUserInfo.login,
      currentUserInfo.uki,
      addItemsEvent
    );
  }
  function handleSharingError(error: Error): Promise<void> {
    if (error.message === "Bad Request (ITEM_GROUP_UPDATE_CONFLICT)") {
      return handleStaleRevision();
    }
    throw error;
  }
  function handleStaleRevision(): Promise<void> {
    const { login, uki } = currentUserInfo;
    return loadSpecialItemGroup(sharingService.ws, login, uki, adminData)
      .then(updateAdminDataWithSpecialItemGroup)
      .then(addKey)
      .then(() => {});
  }
  function updateAdminDataWithSpecialItemGroup(
    specialItemGroup: ItemGroupDownload
  ): Promise<void> {
    const action = specialItemGroupUpdated(teamId, specialItemGroup);
    storeService.dispatch(action);
    return Promise.resolve();
  }
  async function makeAddItemsEvent(): Promise<AddItemsEvent> {
    const { specialItemGroup } = adminData;
    const { crypto } = sharingService;
    const rawItemKey = await crypto.symmetricEncryption.generateNewAESKey();
    const specialItemGroupKey = await getSpecialItemGroupKey(
      crypto,
      currentUserInfo,
      adminData
    );
    const directorySyncKey = { publicKey };
    const directorySyncKey64 = base64.encode(JSON.stringify(directorySyncKey));
    const encryptedContent = await crypto.symmetricEncryption.encryptAES256(
      rawItemKey,
      directorySyncKey64
    );
    const itemKey = await crypto.symmetricEncryption.encryptAES256(
      specialItemGroupKey,
      base64.encode(rawItemKey)
    );
    const itemId = generateItemUuid();
    const itemUpload = await sharingService.item.makeItemUpload(
      itemId,
      itemKey,
      encryptedContent
    );
    return await sharingService.item.makeAddItemsEvent(
      specialItemGroup.groupId,
      specialItemGroup.revision,
      [itemUpload]
    );
  }
}
export function directorySyncForAllTeams(
  storeService: StoreService,
  wsService: WSService,
  sessionService: SessionService
) {
  const teamAdminData = storeService.getTeamAdminData();
  const teams = Object.keys(teamAdminData.teams);
  const syncForTeam = (teamId: string) =>
    directorySyncForTeam(storeService, wsService, sessionService, teamId);
  return teams.map(syncForTeam);
}
class NoRequestError extends Error {
  constructor(message = "") {
    super(message);
    this.name = "NoRequestError";
  }
}
class NewPublicKeyError extends Error {
  constructor(message = "") {
    super(message);
    this.name = "NewPublicKeyError";
  }
}
class InvalidSignatureError extends Error {
  syncResponse: GetDirectorySyncRequestResponse;
  constructor(message = "", syncResponse: GetDirectorySyncRequestResponse) {
    super(message);
    this.name = "InvalidSignatureError";
    this.syncResponse = syncResponse;
  }
}
type DirectorySyncError =
  | Error
  | NoRequestError
  | NewPublicKeyError
  | InvalidSignatureError;
export function directorySyncForTeam(
  storeService: StoreService,
  wsService: WSService,
  sessionService: SessionService,
  teamId: string
): Promise<void> {
  const teamAdminController = makeTeamAdminController(storeService, wsService);
  if (isDirectorySyncInProgress()) {
    Debugger.log(
      `[Directory Sync] Skipping: sync already in progress for team ${teamId}`
    );
    return Promise.resolve();
  }
  setTeamDirectorySyncInProgress();
  return fetchTeamDirectorySyncRequest()
    .then(verifyHasRequest)
    .then(verifyPublicKey)
    .then(verifySignature)
    .then(applyGroupUpdates)
    .then(handleSyncSuccess)
    .catch(handleSyncProcessExit);
  async function fetchTeamDirectorySyncRequest(): Promise<GetDirectorySyncRequestResponse> {
    const login = storeService.getUserLogin();
    const uki = ukiSelector(storeService.getState());
    const params = { teamId: Number(teamId), login, uki };
    return await wsService.teamPlans.getDirectorySyncRequest(params);
  }
  function isDirectorySyncInProgress(): boolean {
    const state = storeService.getState().userSession.directorySync;
    return isTeamDirectorySyncInProgress(state, teamId);
  }
  function setTeamDirectorySyncInProgress() {
    storeService.dispatch(teamDirectorySyncInProgress(teamId));
  }
  function setTeamDirectorySyncNotInProgress() {
    storeService.dispatch(teamDirectorySyncNotInProgress(teamId));
  }
  function callSyncCallback(
    syncResponse: GetDirectorySyncRequestResponse,
    syncError?: string
  ) {
    const {
      content: { id },
    } = syncResponse;
    const login = storeService.getUserLogin();
    const uki = ukiSelector(storeService.getState());
    const baseParams = {
      teamId: Number(teamId),
      login,
      uki,
      requestId: id,
    };
    const params = Object.assign(
      {},
      baseParams,
      syncError ? { syncError } : {}
    );
    return wsService.teamPlans.updateDirectorySyncRequestStatus(params);
  }
  async function handleSyncSuccess(
    syncResponse: GetDirectorySyncRequestResponse
  ) {
    setTeamDirectorySyncNotInProgress();
    return callSyncCallback(syncResponse).then(() => {});
  }
  async function handleSyncProcessExit(
    error: DirectorySyncError
  ): Promise<void> {
    setTeamDirectorySyncNotInProgress();
    switch (error.name) {
      case "NoRequestError":
        break;
      case "NewPublicKeyError":
        break;
      case "InvalidSignatureError": {
        const invalidSignatureError = error as InvalidSignatureError;
        const { syncResponse } = invalidSignatureError;
        callSyncCallback(syncResponse, "invalid_signature").then(() => {});
        break;
      }
      default: {
        const message = `[Directory Sync] unexpected error for team ${teamId}: ${error}`;
        const augmentedError = new Error(message);
        sendExceptionLog({ error: augmentedError });
      }
    }
  }
  async function verifyHasRequest(
    syncResponse: GetDirectorySyncRequestResponse
  ): Promise<GetDirectorySyncRequestResponse> {
    if (!syncResponse.content) {
      throw new NoRequestError();
    }
    return syncResponse;
  }
  async function verifyPublicKey(
    syncResponse: GetDirectorySyncRequestResponse
  ): Promise<GetDirectorySyncRequestResponse> {
    const { publicKey, id } = syncResponse.content;
    const directorySyncKey =
      storeService.getTeamAdminData().teams[teamId].directorySyncKey;
    const savedKeyXMLB64 = directorySyncKey && directorySyncKey.publicKey;
    const publicKeyXMLB64 = keyToXMLB64(publicKey);
    if (publicKeyXMLB64 !== savedKeyXMLB64) {
      const eventParams = {
        teamId,
        publicKey: publicKeyXMLB64,
        requestId: id,
      };
      leeloo().checkDirectorySyncKeyRequest(eventParams);
      const message = `[Directory Sync] in sync request ${syncResponse.content.id} for team ${teamId}: new public key detected for syncRequest.`;
      Debugger.log(message);
      throw new NewPublicKeyError();
    }
    return syncResponse;
  }
  async function verifySignature(
    syncResponse: GetDirectorySyncRequestResponse
  ): Promise<GetDirectorySyncRequestResponse> {
    const valid = await isSignatureValid(syncResponse, teamId);
    if (!valid) {
      const message = `[Directory Sync] in sync request ${syncResponse.content.id} for team ${teamId}: invalid signature.`;
      Debugger.log(message);
      const error = new InvalidSignatureError(message, syncResponse);
      throw error;
    }
    return syncResponse;
  }
  type GroupCreateOperationsRes = CreateUserGroupResult | Error;
  type GroupDeleteOperationsRes = DeleteUserGroupResult | Error;
  type GroupUpdateOperationsRes =
    | InviteUserGroupMembersResult
    | RevokeUserGroupMembersResult
    | RenameUserGroupResult
    | Error;
  type ChainRes = GroupCreateOperationsRes | GroupUpdateOperationsRes;
  type BatchRes = GroupUpdateOperationsRes;
  async function applyGroupUpdates(
    syncResponse: GetDirectorySyncRequestResponse
  ): Promise<GetDirectorySyncRequestResponse> {
    const teamAdminDataTeam = storeService.getTeamAdminData().teams[teamId];
    const currentGroups = teamAdminDataTeam.userGroups || [];
    const syncRequestGroups = syncResponse.content.userGroups || [];
    const toDelete = whichDirectorySyncGroupsToDelete(
      currentGroups,
      syncRequestGroups
    );
    const toCreate = whichDirectorySyncGroupsToCreate(
      currentGroups,
      syncRequestGroups
    );
    const toUpdate = whichDirectorySyncGroupsToUpdate(
      currentGroups,
      syncRequestGroups
    );
    const deleteOperations = toDelete.map((g) => getGroupDeleteOperations(g));
    const createOperations = toCreate.map((g) => getGroupCreateOperations(g));
    const updateOperations = toUpdate
      .map((g) => getGroupUpdateOperations(g, currentGroups))
      .reduce((aggregate, update) => aggregate.concat(update), []);
    const toBeChainedOperations = [...deleteOperations, ...createOperations];
    const toBeBatchedOperations = updateOperations;
    const chainResults = await chainOperations<ChainRes>(toBeChainedOperations);
    const batchResults = await batchOperations<BatchRes>(toBeBatchedOperations);
    const errors = [...chainResults, ...batchResults]
      .filter((r) => r.error)
      .map((r) => r.error);
    errors.forEach((err: Error) => {
      const message = `[Directory Sync] in sync request ${syncResponse.content.id} for team ${teamId}: an operation on groups failed: ${err}`;
      const augmentedError = new Error(message);
      sendExceptionLog({ error: augmentedError });
    });
    return syncResponse;
  }
  function getGroupDeleteOperations(
    group: UserGroupDownload
  ): () => Promise<GroupDeleteOperationsRes> {
    const request = makeDeleteUserGroupRequest(group);
    return () => teamAdminController.deleteUserGroupAction(request);
  }
  function getGroupCreateOperations(
    syncRequestGroup: DirectorySyncUserGroup
  ): () => Promise<GroupCreateOperationsRes> {
    const createGroupRequest = makeCreateUserGroupRequest(syncRequestGroup);
    return () =>
      teamAdminController
        .createUserGroupAction(sessionService, createGroupRequest)
        .then((res) => populateGroup(res, syncRequestGroup));
  }
  function getGroupUpdateOperations(
    syncRequestGroup: DirectorySyncUserGroup,
    currentGroups: UserGroupDownload[]
  ): (() => Promise<GroupUpdateOperationsRes>)[] {
    const currentGroup = currentGroups.find(
      (g) => g.externalId === syncRequestGroup.groupId
    );
    if (!currentGroup) {
      return [];
    }
    const operations = [];
    if (syncRequestGroup.groupName !== currentGroup.name) {
      const operation = () => updateGroupName(currentGroup, syncRequestGroup);
      operations.push(operation);
    }
    if (groupHasMembersToInvite(currentGroup, syncRequestGroup)) {
      const operation = () =>
        inviteGroupMembers(currentGroup, syncRequestGroup);
      operations.push(operation);
    }
    if (groupHasMembersToRevoke(currentGroup, syncRequestGroup)) {
      const operation = () =>
        revokeGroupMembers(currentGroup, syncRequestGroup);
      operations.push(operation);
    }
    return operations;
  }
  function populateGroup(
    res: CreateUserGroupResult,
    syncRequestGroup: DirectorySyncUserGroup
  ): Promise<any> {
    const groups = res.userGroups;
    if (groups.length > 0) {
      const currentGroup = res.userGroups[0];
      return inviteGroupMembers(currentGroup, syncRequestGroup);
    } else {
      return Promise.resolve();
    }
  }
  function makeUserInvite(alias: string): UserInvite {
    return { alias, permission: "limited" as MemberPermission };
  }
  function updateGroupName(
    currentGroup: UserGroupDownload,
    syncRequestGroup: DirectorySyncUserGroup
  ): Promise<RenameUserGroupResult> {
    const request = makeRenameUserGroupRequest(currentGroup, syncRequestGroup);
    return teamAdminController.renameUserGroupAction(request);
  }
  function makeRenameUserGroupRequest(
    currentGroup: UserGroupDownload,
    syncRequestGroup: DirectorySyncUserGroup
  ): RenameUserGroupRequest {
    return {
      groupId: currentGroup.groupId,
      name: syncRequestGroup.groupName,
      revision: currentGroup.revision,
    };
  }
  function inviteGroupMembers(
    currentGroup: UserGroupDownload,
    syncRequestGroup: DirectorySyncUserGroup
  ): Promise<InviteUserGroupMembersResult> {
    const currentUsers = currentGroup.users.map((u) => u.alias);
    const usersToInvite = syncRequestGroup.memberLogins.filter(
      (l) => !currentUsers.includes(l)
    );
    const invitesRequest: InviteUserGroupMembersRequest = {
      groupId: currentGroup.groupId,
      revision: currentGroup.revision,
      users: usersToInvite.map(makeUserInvite),
      teamId: Number(teamId),
    };
    return teamAdminController.inviteUserGroupMembersAction(
      invitesRequest,
      true
    );
  }
  function revokeGroupMembers(
    currentGroup: UserGroupDownload,
    syncRequestGroup: DirectorySyncUserGroup
  ): Promise<RevokeUserGroupMembersResult> {
    const currentUsers = currentGroup.users.map((u) => u.alias);
    const usersToRevoke = currentUsers.filter(
      (u) => !syncRequestGroup.memberLogins.includes(u)
    );
    const revokeRequest: RevokeUserGroupMembersRequest = {
      groupId: currentGroup.groupId,
      revision: currentGroup.revision,
      users: usersToRevoke,
    };
    return teamAdminController.revokeUserGroupMembersAction(revokeRequest);
  }
  function groupHasMembersToInvite(
    currentGroup: UserGroupDownload,
    syncRequestGroup: DirectorySyncUserGroup
  ) {
    const currentUsersLogins = currentGroup.users.map((u) => u.alias);
    return syncRequestGroup.memberLogins.some(
      (l) => !currentUsersLogins.includes(l)
    );
  }
  function groupHasMembersToRevoke(
    currentGroup: UserGroupDownload,
    syncRequestGroup: DirectorySyncUserGroup
  ) {
    const currentUsersLogins = currentGroup.users.map((u) => u.alias);
    return currentUsersLogins.some(
      (l) => !syncRequestGroup.memberLogins.includes(l)
    );
  }
  function makeDeleteUserGroupRequest(
    userGroup: UserGroupDownload
  ): DeleteUserGroupRequest {
    const { groupId, revision } = userGroup;
    return { groupId, revision };
  }
  function makeCreateUserGroupRequest(
    userGroup: DirectorySyncUserGroup
  ): CreateUserGroupRequest {
    const name = userGroup.groupName;
    const externalId = userGroup.groupId;
    return { teamId: Number(teamId), externalId, name };
  }
  function whichDirectorySyncGroupsToDelete(
    currentGroups: UserGroupDownload[],
    syncRequestGroups: DirectorySyncUserGroup[]
  ): UserGroupDownload[] {
    const syncRequestGroupIds = syncRequestGroups.map((g) => g.groupId);
    return currentGroups
      .filter((g) => !!g.externalId)
      .filter((g) => !syncRequestGroupIds.includes(g.externalId));
  }
  function whichDirectorySyncGroupsToCreate(
    currentGroups: UserGroupDownload[],
    syncRequestGroups: DirectorySyncUserGroup[]
  ): DirectorySyncUserGroup[] {
    const currentGroupIds = currentGroups
      .filter((g) => !!g.externalId)
      .map((g) => g.externalId);
    return syncRequestGroups.filter(
      (g) => !currentGroupIds.includes(g.groupId)
    );
  }
  function whichDirectorySyncGroupsToUpdate(
    currentGroups: UserGroupDownload[],
    syncRequestGroups: DirectorySyncUserGroup[]
  ): DirectorySyncUserGroup[] {
    const currentGroupIds = currentGroups
      .filter((g) => !!g.externalId)
      .map((g) => g.externalId);
    return syncRequestGroups.filter((g) => currentGroupIds.includes(g.groupId));
  }
}
export interface OperationResult<T> {
  success: boolean;
  result?: T;
  error?: any;
}
export function batchOperations<T>(
  operations: Array<() => Promise<T>>
): Promise<OperationResult<T>[]> {
  const promises = operations.map((operation) =>
    operation()
      .then((result) => ({ success: true, result }))
      .catch((error) => ({ success: false, error }))
  );
  return Promise.all(promises);
}
export async function chainOperations<T>(
  operations: Array<() => Promise<T>>,
  results: OperationResult<T>[] = []
): Promise<OperationResult<T>[]> {
  const [operation, ...rest] = operations;
  if (!operation) {
    return results;
  }
  let result;
  try {
    const operationResult = await operation();
    result = { success: true, result: operationResult };
  } catch (error) {
    result = { success: false, error };
  }
  return chainOperations(rest, [...results, result]);
}
export function keyToXMLB64({ modulus, exponent }: JsonWebPublicKey): string {
  const xml = `<RSAKeyValue><Modulus>${modulus}</Modulus><Exponent>${exponent}</Exponent></RSAKeyValue>`;
  return base64.encode(xml);
}
export function buildVerifiedSyncResponseData(
  teamId: string,
  userGroups: DirectorySyncUserGroup[],
  matchPowerShellSort?: boolean
): string {
  return (
    teamId +
    userGroups
      .sort(sortGroups)
      .map(matchPowerShellSort ? buildPSGroupData : buildGroupData)
      .join("")
  );
  function sortGroups(
    g1: DirectorySyncUserGroup,
    g2: DirectorySyncUserGroup
  ): number {
    if (g1.groupId < g2.groupId) {
      return -1;
    }
    if (g1.groupId > g2.groupId) {
      return 1;
    }
    return 0;
  }
  function buildGroupData(g: DirectorySyncUserGroup): string {
    const sortedMemberLogins = g.memberLogins.sort();
    return g.groupId + g.groupName + sortedMemberLogins.join("");
  }
  function buildPSGroupData(g: DirectorySyncUserGroup): string {
    const sortedMemberLogins = g.memberLogins.sort(powerShellSort);
    return g.groupId + g.groupName + sortedMemberLogins.join("");
  }
  function powerShellSort(str1: string, str2: string): number {
    const psStr1 = formatForPowerShellSort(str1);
    const psStr2 = formatForPowerShellSort(str2);
    if (psStr1 < psStr2) {
      return -1;
    } else if (psStr1 > psStr2) {
      return 1;
    }
    return handleWordSort(str1, str2);
  }
  function formatForPowerShellSort(str: string): string {
    let result = str.replace(/[-']/g, "");
    result = result.replace(/\./g, "$");
    result = result.replace(/@/g, "%");
    result = result.replace(/_/g, "'");
    return result;
  }
  function handleWordSort(str1: string, str2: string): number {
    if (str1.length < str2.length) {
      return -1;
    } else if (str1.length > str2.length) {
      return 1;
    }
    const hyphenCount1 = str1.split("-").length - 1;
    const hyphenCount2 = str2.split("-").length - 1;
    if (hyphenCount1 < hyphenCount2) {
      return -1;
    } else if (hyphenCount1 > hyphenCount2) {
      return 1;
    }
    return 0;
  }
}
export async function isSignatureValid(
  syncResponse: GetDirectorySyncRequestResponse,
  teamId: string
): Promise<boolean> {
  const {
    content: { signature, userGroups, publicKey },
  } = syncResponse;
  const validateSignature = async (matchPowerShellSort: boolean) => {
    const userGroupsData = buildVerifiedSyncResponseData(
      teamId,
      userGroups,
      matchPowerShellSort
    );
    const userGroupsDataB64 = base64.encode(userGroupsData);
    const asymmetricEncryption = makeAsymmetricEncryption();
    return await asymmetricEncryption.verifyJwk(
      publicKey,
      signature,
      userGroupsDataB64
    );
  };
  const normalSortResult = await validateSignature(false);
  if (normalSortResult) {
    return normalSortResult;
  } else {
    return validateSignature(true);
  }
}
export function keyRejectedByTacAdmin(
  storeService: StoreService,
  wsService: WSService,
  teamId: string,
  requestId: number
): Promise<void> {
  const login = storeService.getUserLogin();
  const uki = ukiSelector(storeService.getState());
  const syncError = "key_rejected";
  const params = { teamId: Number(teamId), login, uki, requestId, syncError };
  return wsService.teamPlans
    .updateDirectorySyncRequestStatus(params)
    .then(() => {});
}
export function isDirectorySyncActivated(spaceData: SpaceData): boolean {
  const acceptedSpace = spaceData.spaces.find(
    (space) =>
      space.details && space.details.info && space.details.status === "accepted"
  );
  if (!acceptedSpace) {
    return false;
  }
  const activeDirectorySyncType =
    acceptedSpace.details.info["activeDirectorySyncType"];
  return ["full", "provision-only"].includes(activeDirectorySyncType);
}
