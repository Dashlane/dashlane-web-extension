import {
  AcceptTeamInviteRequest,
  AddTeamAdminRequest,
  AddTeamAdminResult,
  CreateUserGroupRequest,
  CreateUserGroupResult,
  DeleteUserGroupRequest,
  DeleteUserGroupResult,
  GetTeamMembersRequest,
  GetTeamMembersResult,
  InviteUserGroupMembersRequest,
  InviteUserGroupMembersResult,
  PremiumStatusRequest,
  PremiumStatusResponse,
  RegisterFreeTrialRequest,
  RemoveTeamAdminRequest,
  RemoveTeamAdminResult,
  RenameUserGroupRequest,
  RenameUserGroupResult,
  RevokeUserGroupMembersRequest,
  RevokeUserGroupMembersResult,
  Space,
  TeamUpdatedRequest,
  TokensResponse,
  UpdateUserGroupMembersRequest,
  UpdateUserGroupMembersResult,
  UserInvite,
} from "@dashlane/communication";
import { ISharingServices, makeSharingService } from "Sharing/2/Services";
import { getCurrentUserInfo } from "Session/utils";
import { StoreService } from "Store";
import * as TeamAdminManagementService from "TeamAdmin/Services/TeamAdminManagementService";
import { WSService } from "Libs/WS/index";
import {
  createUserGroupAdminItemInState,
  deleteAdministrableUserGroups,
  updateAdministrableUserGroupList,
} from "TeamAdmin/Services/UserGroupManagementSetupService/teamAdminData";
import {
  createUserGroup,
  deleteUserGroup,
  emptySessionResponse,
  inviteUserGroupMembers,
  renameUserGroup,
  revokeUserGroupMembers,
  updateUserGroupMembers,
} from "Sharing/2/SharingController";
import { SessionService } from "User/Services/types";
import { getUserGroup } from "TeamAdmin/Services";
import { updateSpaceData } from "Session/SpaceDataController";
import { specialItemGroupUpdated } from "Session/Store/teamAdminData/actions";
export interface TeamAdminController {
  getMembers: (
    getMembersRequest: GetTeamMembersRequest
  ) => Promise<GetTeamMembersResult>;
  proposeMembers: (
    proposeMembersRequest: TeamAdminManagementService.ProposeMembersRequest
  ) => Promise<TeamAdminManagementService.ProposeMembersResult>;
  addTeamAdmin: (
    addTeamAdminRequest: AddTeamAdminRequest
  ) => Promise<AddTeamAdminResult>;
  removeTeamAdmin: (
    removeTeamAdminRequest: RemoveTeamAdminRequest
  ) => Promise<RemoveTeamAdminResult>;
  createUserGroupAction: (
    sessionService: SessionService,
    createUserGroupRequest: CreateUserGroupRequest
  ) => Promise<CreateUserGroupResult>;
  deleteUserGroupAction: (
    deleteUserGroupRequest: DeleteUserGroupRequest
  ) => Promise<DeleteUserGroupResult>;
  renameUserGroupAction: (
    renameUserGroupRequest: RenameUserGroupRequest
  ) => Promise<RenameUserGroupResult>;
  inviteUserGroupMembersAction: (
    inviteMemberRequest: InviteUserGroupMembersRequest
  ) => Promise<InviteUserGroupMembersResult>;
  revokeUserGroupMembersAction: (
    revokeUserGroupMembersRequest: RevokeUserGroupMembersRequest
  ) => Promise<RevokeUserGroupMembersResult>;
  updateUserGroupMembersAction: (
    updateMembersRequest: UpdateUserGroupMembersRequest
  ) => Promise<UpdateUserGroupMembersResult>;
  teamUpdateHandler: (
    teamUpdatedRequest: TeamUpdatedRequest
  ) => Promise<Error[]>;
  confirmFreeTrial: (token: string) => Promise<{}>;
  getPremiumStatus: (
    request: PremiumStatusRequest
  ) => Promise<PremiumStatusResponse>;
  getTeamTokens: () => Promise<TokensResponse>;
  registerFreeTrial: (request: RegisterFreeTrialRequest) => Promise<{}>;
  acceptTeamInvite: (request: AcceptTeamInviteRequest) => Promise<{}>;
}
export const makeTeamAdminController = (
  storeService: StoreService,
  wsService: WSService
): TeamAdminController => {
  return {
    getMembers: (getMembersRequest) =>
      getMembers(storeService, getMembersRequest),
    proposeMembers: (proposeMembersRequest) =>
      proposeMembers(storeService, wsService, proposeMembersRequest),
    addTeamAdmin: (addTeamAdminRequest) =>
      addTeamAdmin(storeService, wsService, addTeamAdminRequest),
    removeTeamAdmin: (removeTeamAdminRequest) =>
      removeTeamAdmin(storeService, wsService, removeTeamAdminRequest),
    createUserGroupAction: (sessionService, createUserGroupRequest) =>
      createUserGroupAction(
        storeService,
        sessionService,
        wsService,
        createUserGroupRequest
      ),
    deleteUserGroupAction: (deleteUserGroupRequest) =>
      deleteUserGroupAction(storeService, wsService, deleteUserGroupRequest),
    renameUserGroupAction: (renameUserGroupRequest) =>
      renameUserGroupAction(storeService, wsService, renameUserGroupRequest),
    inviteUserGroupMembersAction: (inviteMemberRequest) =>
      inviteUserGroupMembersAction(
        storeService,
        wsService,
        inviteMemberRequest
      ),
    revokeUserGroupMembersAction: (revokeUserGroupMembersRequest) =>
      revokeUserGroupMembersAction(
        storeService,
        wsService,
        revokeUserGroupMembersRequest
      ),
    updateUserGroupMembersAction: (updateMembersRequest) =>
      updateUserGroupMembersAction(
        storeService,
        wsService,
        updateMembersRequest
      ),
    teamUpdateHandler: (teamUpdatedRequest) =>
      teamUpdateHandler(storeService, teamUpdatedRequest),
    confirmFreeTrial: (token) => confirmFreeTrial(wsService, token),
    getPremiumStatus: (request) => getPremiumStatus(wsService, request),
    getTeamTokens: () => getTeamTokens(storeService, wsService),
    registerFreeTrial: (request) => registerFreeTrial(wsService, request),
    acceptTeamInvite: (request) => acceptTeamInvite(wsService, request),
  };
};
function registerFreeTrial(
  wsService: WSService,
  request: RegisterFreeTrialRequest
) {
  return wsService.teamPlans.registerFreeTrial(request);
}
function getTeamTokens(storeService: StoreService, wsService: WSService) {
  const login = storeService.getUserLogin();
  return wsService.qa.tokens({ login });
}
function confirmFreeTrial(wsService: WSService, token: string) {
  return wsService.teamPlans.confirmFreeTrial({ token });
}
function getPremiumStatus(wsService: WSService, request: PremiumStatusRequest) {
  return wsService.premium.status(request);
}
function acceptTeamInvite(
  wsService: WSService,
  request: AcceptTeamInviteRequest
) {
  const { token } = request;
  return wsService.teamPlans.acceptTeam({ token });
}
function getMembers(
  storeService: StoreService,
  getMembersRequest: GetTeamMembersRequest
): Promise<GetTeamMembersResult> {
  return TeamAdminManagementService.getMembers(
    storeService,
    getCurrentUserInfo(storeService).login,
    getMembersRequest
  );
}
function proposeMembers(
  storeService: StoreService,
  wsService: WSService,
  proposeMembersRequest: TeamAdminManagementService.ProposeMembersRequest
): Promise<TeamAdminManagementService.ProposeMembersResult> {
  return TeamAdminManagementService.proposeMembers(
    wsService,
    getCurrentUserInfo(storeService),
    proposeMembersRequest
  );
}
function addTeamAdmin(
  storeService: StoreService,
  wsService: WSService,
  addTeamAdminRequest: AddTeamAdminRequest
): Promise<AddTeamAdminResult> {
  if (!storeService.isAuthenticated()) {
    return emptySessionResponse(addTeamAdminRequest);
  }
  const sharingService = makeSharingService(storeService, wsService);
  return TeamAdminManagementService.addTeamAdmin(
    sharingService,
    addTeamAdminRequest
  ).catch((error) => ({ error }));
}
function removeTeamAdmin(
  storeService: StoreService,
  wsService: WSService,
  removeTeamAdminRequest: RemoveTeamAdminRequest
): Promise<RemoveTeamAdminResult> {
  if (!storeService.isAuthenticated()) {
    return emptySessionResponse(removeTeamAdminRequest);
  }
  const sharingService = makeSharingService(storeService, wsService);
  return TeamAdminManagementService.removeTeamAdmin(
    sharingService,
    removeTeamAdminRequest
  ).catch((error) => ({ error }));
}
function createUserGroupAction(
  storeService: StoreService,
  sessionService: SessionService,
  wsService: WSService,
  createUserGroupRequest: CreateUserGroupRequest
): Promise<CreateUserGroupResult> {
  if (!storeService.isAuthenticated()) {
    return emptySessionResponse(createUserGroupRequest);
  }
  const sharingService = makeSharingService(storeService, wsService);
  const currentUserInfo = getCurrentUserInfo(storeService);
  const currentTeamAdminData = storeService.getTeamAdminData();
  return createUserGroup(
    sharingService,
    currentUserInfo,
    currentTeamAdminData,
    createUserGroupRequest
  )
    .then((result) => {
      if (Array.isArray(result.itemGroups) && result.itemGroups.length > 0) {
        const specialItemGroup = result.itemGroups[0];
        const teamIdString = String(specialItemGroup.teamId);
        const updateAction = specialItemGroupUpdated(
          teamIdString,
          specialItemGroup
        );
        storeService.dispatch(updateAction);
      }
      const teamId = createUserGroupRequest.teamId;
      const currentUserGroupsForTeam =
        (storeService.getTeamAdminData().teams[teamId] &&
          storeService.getTeamAdminData().teams[teamId].userGroups) ||
        [];
      updateAdministrableUserGroupList(
        storeService,
        teamId.toString(),
        currentUserGroupsForTeam.concat(result.userGroups)
      );
      if (result.userGroupAdminItem) {
        createUserGroupAdminItemInState(
          storeService,
          teamId.toString(),
          result.userGroupAdminItem
        );
        sessionService
          .getInstance()
          .user.persistTeamAdminData()
          .then(() => result);
      }
      return result;
    })
    .then((result) => {
      return {
        userGroups: result.userGroups,
        error: result.error,
      };
    });
}
function deleteUserGroupAction(
  storeService: StoreService,
  wsService: WSService,
  deleteUserGroupRequest: DeleteUserGroupRequest
): Promise<DeleteUserGroupResult> {
  if (!storeService.isAuthenticated()) {
    return emptySessionResponse(deleteUserGroupRequest);
  }
  const sharingService = makeSharingService(storeService, wsService);
  const currentUserInfo = getCurrentUserInfo(storeService);
  const userGroup = findUserGroupInState(
    storeService,
    deleteUserGroupRequest.groupId
  );
  return deleteUserGroup(
    sharingService,
    currentUserInfo,
    storeService.getTeamAdminData(),
    deleteUserGroupRequest
  ).then(({ userGroups, itemGroups }) => {
    const specialItemGroup = itemGroups[0];
    const teamIdString = String(specialItemGroup.teamId);
    const updateAction = specialItemGroupUpdated(
      teamIdString,
      specialItemGroup
    );
    storeService.dispatch(updateAction);
    deleteAdministrableUserGroups(
      storeService,
      String(userGroup.teamId),
      userGroups
    );
    return { userGroups };
  });
}
function renameUserGroupAction(
  storeService: StoreService,
  wsService: WSService,
  renameUserGroupRequest: RenameUserGroupRequest
): Promise<RenameUserGroupResult> {
  if (!storeService.isAuthenticated()) {
    return emptySessionResponse(renameUserGroupRequest);
  }
  const sharingService = makeSharingService(storeService, wsService);
  const currentUserInfo = getCurrentUserInfo(storeService);
  return renameUserGroup(
    sharingService,
    currentUserInfo,
    renameUserGroupRequest
  ).then(({ userGroups }) => {
    if (userGroups && userGroups.length === 1) {
      const teamId = String(userGroups[0].teamId);
      const currentUserGroupsForTeam =
        (storeService.getTeamAdminData().teams[teamId] &&
          storeService.getTeamAdminData().teams[teamId].userGroups) ||
        [];
      const updatedUserGroups = currentUserGroupsForTeam.map((userGroup) => {
        if (userGroup.groupId === renameUserGroupRequest.groupId) {
          return userGroups[0] || userGroup;
        }
        return userGroup;
      });
      updateAdministrableUserGroupList(storeService, teamId, updatedUserGroups);
    }
    return { userGroups };
  });
}
function findUserGroupInState(storeService: StoreService, groupId: string) {
  return getUserGroup(storeService.getTeamAdminData(), groupId);
}
function inviteUserGroupMembersAction(
  storeService: StoreService,
  wsService: WSService,
  inviteMemberRequest: InviteUserGroupMembersRequest
): Promise<InviteUserGroupMembersResult> {
  if (!storeService.isAuthenticated()) {
    return emptySessionResponse(inviteMemberRequest);
  }
  const sharingService = makeSharingService(storeService, wsService);
  const currentUserInfo = getCurrentUserInfo(storeService);
  const teamAdminData = storeService.getTeamAdminData();
  const userGroup = findUserGroupInState(
    storeService,
    inviteMemberRequest.groupId
  );
  const invitedUsersMap: {
    [alias: string]: UserInvite;
  } = {};
  inviteMemberRequest.users.forEach(
    (user) => (invitedUsersMap[user.alias] = user)
  );
  const proposeMemberRequest: TeamAdminManagementService.ProposeMembersRequest =
    {
      proposedMemberLogins: Object.keys(invitedUsersMap),
      teamId: inviteMemberRequest.teamId,
      origin: "teamInviteUserGroupUsers",
      notificationOptions: { skipAccountCreationRequiredAlerts: true },
    };
  return proposeMembers(storeService, wsService, proposeMemberRequest)
    .then((proposeMemberResult) => {
      const usersToInvite: UserInvite[] = Object.keys(
        proposeMemberResult.proposedMembers
      ).map((alias) => invitedUsersMap[alias]);
      proposeMemberResult.accountCreationRequiredMembers.forEach((alias) =>
        usersToInvite.push(invitedUsersMap[alias])
      );
      const refusedMembers: {
        [login: string]: string;
      } = {};
      Object.keys(proposeMemberResult.refusedMembers).forEach((alias) => {
        const refusalReason = proposeMemberResult.refusedMembers[alias];
        if (refusalReason === "already_member") {
          usersToInvite.push(invitedUsersMap[alias]);
          return;
        }
        refusedMembers[alias] = refusalReason;
      });
      if (usersToInvite.length === 0) {
        const res: InviteUserGroupMembersResult = {
          userGroups: [userGroup],
          refusedMembers,
        };
        return res;
      }
      const inviteMemberRequestWithUserInTeamOnly = {
        ...inviteMemberRequest,
        users: usersToInvite,
      };
      return inviteUserGroupMembers(
        sharingService,
        currentUserInfo,
        teamAdminData,
        inviteMemberRequestWithUserInTeamOnly,
        userGroup
      ).then((inviteUserGroupMembersResult) => {
        if (inviteUserGroupMembersResult.error) {
          return inviteUserGroupMembersResult;
        }
        const teamId = String(
          inviteUserGroupMembersResult.userGroups[0].teamId
        );
        const currentUserGroupsForTeam =
          (storeService.getTeamAdminData().teams[teamId] &&
            storeService.getTeamAdminData().teams[teamId].userGroups) ||
          [];
        const userGroups = currentUserGroupsForTeam.map((userGroup) => {
          if (userGroup.groupId === inviteMemberRequest.groupId) {
            return (
              (inviteUserGroupMembersResult.userGroups &&
                inviteUserGroupMembersResult.userGroups[0]) ||
              userGroup
            );
          }
          return userGroup;
        });
        updateAdministrableUserGroupList(
          storeService,
          String(userGroup.teamId),
          userGroups
        );
        return { ...inviteUserGroupMembersResult, refusedMembers };
      });
    })
    .catch((e) => {
      if (e?.additionalInfo?.code === 400) {
        return Promise.resolve({
          refusedMembers: {},
          userGroups: [],
          error: {
            message: e.additionalInfo?.webServiceSubMessage || "unknown error",
          },
        });
      }
      throw e;
    });
}
function revokeUserGroupMembersAction(
  storeService: StoreService,
  wsService: WSService,
  revokeUserGroupMembersRequest: RevokeUserGroupMembersRequest
): Promise<RevokeUserGroupMembersResult> {
  if (!storeService.isAuthenticated()) {
    return emptySessionResponse(revokeUserGroupMembersRequest);
  }
  const sharingService: ISharingServices = makeSharingService(
    storeService,
    wsService
  );
  const currentUserInfo = getCurrentUserInfo(storeService);
  return revokeUserGroupMembers(
    sharingService,
    currentUserInfo,
    revokeUserGroupMembersRequest
  ).then((result) => {
    if (result && result.userGroups && result.userGroups.length === 1) {
      const updatedUserGroup = result.userGroups[0];
      const currentUserGroupsForTeam =
        (storeService.getTeamAdminData().teams[updatedUserGroup.teamId] &&
          storeService.getTeamAdminData().teams[updatedUserGroup.teamId]
            .userGroups) ||
        [];
      const userGroups = currentUserGroupsForTeam.map((userGroup) => {
        if (userGroup.groupId === revokeUserGroupMembersRequest.groupId) {
          return (result.userGroups && result.userGroups[0]) || userGroup;
        }
        return userGroup;
      });
      updateAdministrableUserGroupList(
        storeService,
        String(updatedUserGroup.teamId),
        userGroups
      );
    }
    return result;
  });
}
function updateUserGroupMembersAction(
  storeService: StoreService,
  wsService: WSService,
  updateMembersRequest: UpdateUserGroupMembersRequest
): Promise<UpdateUserGroupMembersResult> {
  if (!storeService.isAuthenticated()) {
    return emptySessionResponse(updateMembersRequest);
  }
  const sharingService = makeSharingService(storeService, wsService);
  const currentUserInfo = getCurrentUserInfo(storeService);
  return updateUserGroupMembers(
    sharingService,
    currentUserInfo,
    updateMembersRequest
  );
}
function updateTeamAdminsList(space: Space, event: TeamUpdatedRequest) {
  const { teamAdmins } = space.details;
  switch (event.action) {
    case "adminPromoted":
      return teamAdmins.concat(event.users.map((login) => ({ login })));
    case "adminDemoted":
      return teamAdmins.filter((admin) => !event.users.includes(admin.login));
    default:
      return teamAdmins;
  }
}
function teamUpdateHandler(
  storeService: StoreService,
  event: TeamUpdatedRequest
): Promise<Error[] | null> {
  return Promise.resolve().then(() => {
    if (!storeService.isAuthenticated()) {
      return [new Error("no session set")];
    }
    const updateTeamSpaces = () => {
      const spaceData = storeService.getSpaceData();
      const spaces = spaceData.spaces.map((space) => {
        if (space.details.teamId !== event.teamId.toString()) {
          return space;
        }
        const teamAdmins = updateTeamAdminsList(space, event);
        return Object.assign({}, space, {
          details: Object.assign({}, space.details, {
            teamAdmins,
          }),
        });
      });
      updateSpaceData(storeService, spaces);
    };
    if (["adminPromoted", "adminDemoted"].includes(event.action)) {
      updateTeamSpaces();
    }
    if (event.action === "memberRevoked") {
      const adminData = storeService.getTeamAdminData().teams[event.teamId];
      const userGroups = (adminData.userGroups || []).map((userGroup) =>
        Object.assign({}, userGroup, {
          users: userGroup.users.filter(
            (user) => !event.users.includes(user.alias)
          ),
        })
      );
      updateAdministrableUserGroupList(
        storeService,
        adminData.teamId,
        userGroups
      );
    }
    return null;
  });
}
