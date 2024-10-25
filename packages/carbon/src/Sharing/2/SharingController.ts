import * as R from "ramda";
import {
  CreateUserGroupResult as BaseCreateUserGroupResult,
  CreateUserGroupRequest,
  DeleteUserGroupRequest,
  DeleteUserGroupResult,
  InviteUserGroupMembersRequest,
  InviteUserGroupMembersResult,
  Member,
  MemberPermission,
  MemberStatus,
  Recipient,
  RenameUserGroupRequest,
  RenameUserGroupResult,
  RevokeUserGroupMembersRequest,
  RevokeUserGroupMembersResult,
  ShareItemFailureReason,
  ShareItemResponse,
  Space,
  SpaceStatus,
  UpdateUserGroupMembersResult,
  UserGroupRequest,
  UserInvite,
} from "@dashlane/communication";
import { Trigger } from "@dashlane/hermes";
import { GetSharing } from "@dashlane/sharing/types/getSharing";
import {
  ItemGroupDownload,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import { SpaceData } from "Session/Store/spaceData";
import {
  ItemGroupSummary,
  ItemSummary,
  Sharing2Summary,
  SharingData,
  UserGroupSummary,
} from "Session/Store/sharingData/types";
import { FindUsersResponse } from "Libs/WS/UserAlias";
import { ISharingServices } from "Sharing/2/Services";
import { sendExceptionLog } from "Logs/Exception/index";
import { Debugger } from "Logs/Debugger";
import { CurrentUserInfo } from "Session/utils";
import {
  TeamAdminData,
  UserGroupAdminItem,
} from "Session/Store/teamAdminData/types";
import {
  findTeamForGroup,
  getUserGroupAdminItem,
} from "TeamAdmin/Services/index";
import { CreateUserGroupEvent } from "@dashlane/sharing/types/userGroup/createUserGroup";
import { StoreService } from "Store/index";
import { WSService } from "Libs/WS/index";
import { WSError } from "Libs/WS/Errors";
import {
  shareAlreadySharedItem,
  shareUnsharedItem,
} from "Sharing/2/Services/SharingUserActionsService";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { isAllowedToShareSelector } from "Sharing/2/Services/selectors/is-allowed-to-share.selector";
import {
  getNodePremiumStatusSpaceData,
  hasSpecialUserGroupAccessInSpace,
} from "Store/helpers/spaceData";
import { CoreServices } from "Services";
export interface UserGroupMember {
  Alias: string;
  Login?: string;
  PublicKey?: string;
  Permission: MemberPermission;
  Status?: MemberStatus;
}
export interface CreateUserGroupResult extends BaseCreateUserGroupResult {
  userGroupAdminItem?: UserGroupAdminItem;
}
function throwIfInvalidRequest(
  currentUserInfo: CurrentUserInfo,
  {
    groupId,
    revision,
  }: {
    groupId: string;
    revision: number;
  }
) {
  if (!currentUserInfo.privateKey) {
    throw new Error("PRIVATE_KEY_MISSING");
  }
  if (!groupId) {
    throw new Error("GROUP_ID_MISSING");
  }
  if (!revision) {
    throw new Error("GROUP_REVISION_MISSING");
  }
}
export function getOutdatedSharingParams(
  sharing2Summary: Sharing2Summary,
  sharingData: SharingData
): GetSharingParams {
  const filterItems = ({ id, timestamp }: ItemSummary) =>
    !sharingData.items.find(
      (item) => item.itemId === id && item.timestamp >= timestamp
    );
  const filterItemGroups = ({ id, revision }: ItemGroupSummary) =>
    !sharingData.itemGroups.find(
      (group) => group.groupId === id && group.revision === revision
    );
  const filterUserGroups = ({ id, revision }: UserGroupSummary) =>
    !sharingData.userGroups.find(
      (group) => group.groupId === id && group.revision === revision
    );
  return {
    itemIds: sharing2Summary.items.filter(filterItems).map((item) => item.id),
    itemGroupIds: sharing2Summary.itemGroups
      .filter(filterItemGroups)
      .map((group) => group.id),
    userGroupIds: sharing2Summary.userGroups
      .filter(filterUserGroups)
      .map((group) => group.id),
  };
}
export function getCleanSharingData(
  sharing2Summary: Sharing2Summary,
  sharingData: SharingData
): SharingData {
  const { items, itemGroups, userGroups } = sharing2Summary;
  return {
    items: sharingData.items.filter((item) =>
      items.find((i) => i.id === item.itemId)
    ),
    itemGroups: sharingData.itemGroups.filter((itemGroup) =>
      itemGroups.find((group) => group.id === itemGroup.groupId)
    ),
    userGroups: sharingData.userGroups.filter((userGroup) =>
      userGroups.find((group) => group.id === userGroup.groupId)
    ),
  };
}
export function mergeSharingData(
  sharingData1: SharingData,
  sharingData2: SharingData
): SharingData {
  const mergeChanges = <Item extends Object>(
    storedItems: Item[],
    updatedItems: Item[],
    getKey: (obj: Object) => string | number
  ): Item[] => {
    const newItems = updatedItems.filter((updatedItem) => {
      return !storedItems.find(
        (storedItem) => getKey(storedItem) === getKey(updatedItem)
      );
    });
    const items = storedItems.map((storedItem) => {
      const updatedItem = updatedItems.find(
        (item) => getKey(item) === getKey(storedItem)
      );
      return updatedItem || storedItem;
    });
    return items.concat(newItems);
  };
  return {
    items: mergeChanges(
      sharingData1.items,
      sharingData2.items,
      R.prop("itemId")
    ),
    itemGroups: mergeChanges(
      sharingData1.itemGroups,
      sharingData2.itemGroups,
      R.prop("groupId")
    ),
    userGroups: mergeChanges(
      sharingData1.userGroups,
      sharingData2.userGroups,
      R.prop("groupId")
    ),
  };
}
export async function buildSharingData(
  wsService: WSService,
  login: string,
  uki: string,
  sharing2Summary: Sharing2Summary,
  storedSharingData: SharingData
) {
  const sharingData = getCleanSharingData(sharing2Summary, storedSharingData);
  const dataToFetch: GetSharingParams = getOutdatedSharingParams(
    sharing2Summary,
    sharingData
  );
  const ids = R.unnest(R.values(dataToFetch));
  const shouldSkip = R.compose(R.equals(0), R.length);
  if (shouldSkip(ids)) {
    return sharingData;
  }
  const fetchedSharingData = await getSharedData(
    wsService,
    login,
    uki,
    dataToFetch
  );
  return mergeSharingData(sharingData, fetchedSharingData);
}
const throwIfInvalidGroupAction = (
  teamId: number,
  currentUserInfo: CurrentUserInfo,
  storeService: StoreService
) => {
  const spaceData = getNodePremiumStatusSpaceData(storeService);
  const space = spaceData.spaces.find(
    (s: Space) => Number(s.teamId) === teamId
  );
  if (!space) {
    throw new Error("TEAM_NOT_FOUND");
  }
  if (!hasSpecialUserGroupAccessInSpace(space.teamId, spaceData)) {
    throw new Error("USER_DOES_NOT_HAVE_SPECIAL_USER_GROUP_ACCESS_FOR_TEAM");
  }
  if (!currentUserInfo.privateKey) {
    throw new Error("PRIVATE_KEY_MISSING");
  }
};
export function createUserGroup(
  services: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  currentTeamAdminData: TeamAdminData,
  createUserGroupRequest: CreateUserGroupRequest
): Promise<CreateUserGroupResult> {
  return Promise.resolve()
    .then(() => {
      throwIfInvalidGroupAction(
        createUserGroupRequest.teamId,
        currentUserInfo,
        services.store
      );
      return services.userGroup
        .makeUserGroupAdminItem()
        .then((userGroupAdminItem) => {
          return Promise.all([
            services.userGroup.makeCreateUserGroupEvent(
              currentUserInfo,
              currentTeamAdminData,
              createUserGroupRequest,
              userGroupAdminItem
            ),
            Promise.resolve(userGroupAdminItem),
          ]);
        });
    })
    .then(
      ([userGroupRequestEvent, userGroupAdminItem]: [
        CreateUserGroupEvent,
        UserGroupAdminItem
      ]) => {
        return services.userGroup
          .createUserGroup(
            currentUserInfo,
            currentTeamAdminData.teams[createUserGroupRequest.teamId],
            userGroupRequestEvent
          )
          .then(({ userGroups, itemGroups }) => {
            return { userGroups, userGroupAdminItem, itemGroups };
          });
      }
    )
    .catch((error: Error) => {
      return reportError(
        "Error while creating userGroup ",
        error,
        createUserGroupRequest
      );
    });
}
export function createSpecialUserGroup(
  services: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  currentSpaceData: SpaceData,
  teamId: number
): Promise<UserGroupDownload> {
  const createUserGroupRequest = { teamId, name: "_team_admin_user_group" };
  return Promise.resolve()
    .then(() => {
      throwIfInvalidGroupAction(teamId, currentUserInfo, services.store);
      const space = currentSpaceData.spaces.find(
        (s: Space) => Number(s.teamId) === teamId
      );
      const members: Member[] = space.details.teamAdmins.map((teamAdmin) => ({
        Alias: teamAdmin.login,
        Login: teamAdmin.login,
        Permission: "admin" as MemberPermission,
        Status:
          teamAdmin.login === currentUserInfo.login
            ? SpaceStatus.Accepted
            : SpaceStatus.Pending,
      }));
      const aliasesExtracted = extractAliasesFromMembers(members);
      return services.userGroup
        .findExistingUsersByAliases({
          login: currentUserInfo.login,
          uki: currentUserInfo.uki,
          aliases: aliasesExtracted,
        })
        .then(
          (findUserServiceResponse: { [key: string]: FindUsersResponse }) => {
            return {
              findUserServiceResponse,
              members,
            };
          }
        );
    })
    .then(
      ({
        findUserServiceResponse,
        members,
      }: {
        findUserServiceResponse: {
          [key: string]: FindUsersResponse;
        };
        members: Member[];
      }) => {
        const userGroupMembers = computeUserGroupMember(
          members,
          findUserServiceResponse
        );
        return services.userGroup.makeCreateSpecialUserGroupEvent(
          currentUserInfo,
          createUserGroupRequest,
          userGroupMembers
        );
      }
    )
    .then((userGroupRequest) => {
      return services.userGroup.createUserGroup(
        currentUserInfo,
        { teamId: String(teamId) },
        userGroupRequest
      );
    })
    .then(({ userGroups }) => {
      return userGroups && userGroups.length && userGroups[0];
    });
}
export function createSpecialItemGroup(
  services: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  specialUserGroup: UserGroupDownload,
  userGroupAdminItems: UserGroupAdminItem[]
): Promise<ItemGroupDownload> {
  return Promise.resolve()
    .then(() => {
      throwIfInvalidGroupAction(
        specialUserGroup.teamId,
        currentUserInfo,
        services.store
      );
      return services.itemGroup.makeCreateSpecialItemGroupEvent(
        currentUserInfo,
        specialUserGroup,
        userGroupAdminItems
      );
    })
    .then((itemGroupRequest) => {
      return services.itemGroup.createSpecialItemGroup(
        currentUserInfo,
        itemGroupRequest
      );
    });
}
export function deleteItemGroup(
  services: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  {
    groupId,
    revision,
  }: {
    groupId: string;
    revision: number;
  }
): Promise<ItemGroupDownload[]> {
  return Promise.resolve()
    .then(() => {
      throwIfInvalidRequest(currentUserInfo, { groupId, revision });
      return services.itemGroup
        .makeDeleteItemGroupEvent(groupId, revision)
        .then((itemGroupRequest) => {
          return services.itemGroup.deleteItemGroup(
            currentUserInfo,
            itemGroupRequest
          );
        });
    })
    .catch((error: Error) => {
      reportError("Error while deleting itemGroup ", error, {
        groupId,
        revision,
      });
      return [];
    });
}
export function deleteUserGroup(
  services: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  currentTeamAdminData: TeamAdminData,
  deleteUserGroupRequest: DeleteUserGroupRequest
): Promise<DeleteUserGroupResult> {
  const adminData = findTeamForGroup(
    currentTeamAdminData,
    deleteUserGroupRequest.groupId
  );
  return Promise.resolve()
    .then(() => {
      throwIfInvalidRequest(currentUserInfo, deleteUserGroupRequest);
      const { groupId, revision } = deleteUserGroupRequest;
      const userGroupAdminItems =
        (adminData && adminData.userGroupAdminItems) || [];
      const userGroupAdminItem = userGroupAdminItems.find(
        (item) => item.groupId === deleteUserGroupRequest.groupId
      );
      const specialItemGroupRevision =
        adminData.specialItemGroup && adminData.specialItemGroup.revision;
      return services.userGroup.makeDeleteUserGroupEvent(
        groupId,
        revision,
        userGroupAdminItem.itemId,
        specialItemGroupRevision
      );
    })
    .then((userGroupRequest) => {
      return services.userGroup.deleteUserGroup(
        currentUserInfo,
        adminData,
        userGroupRequest
      );
    })
    .catch((error: Error) => {
      return reportError(
        "Error while deleting userGroup ",
        error,
        deleteUserGroupRequest
      );
    });
}
export function renameUserGroup(
  services: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  renameUserGroupRequest: RenameUserGroupRequest
): Promise<RenameUserGroupResult> {
  return Promise.resolve()
    .then(() => {
      throwIfInvalidRequest(currentUserInfo, renameUserGroupRequest);
      const { groupId, revision, name } = renameUserGroupRequest;
      return services.userGroup
        .makeRenameUserGroupEvent(groupId, revision, name)
        .then((userGroupRequest) => {
          return services.userGroup.renameUserGroup(
            currentUserInfo,
            userGroupRequest
          );
        });
    })
    .catch((error: Error) => {
      return reportError(
        "Error while renaming userGroup ",
        error,
        renameUserGroupRequest
      );
    });
}
export function inviteUserGroupMembers(
  services: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  teamAdminData: TeamAdminData,
  inviteUserGroupMembersRequest: InviteUserGroupMembersRequest,
  userGroup: UserGroupDownload
): Promise<InviteUserGroupMembersResult> {
  return Promise.resolve()
    .then(() => {
      throwIfInvalidRequest(currentUserInfo, inviteUserGroupMembersRequest);
      if (inviteUserGroupMembersRequest.users.length === 0) {
        throw new Error("USERS_NOT_SUPPLIED");
      }
      const { login, uki } = currentUserInfo;
      const aliases = JSON.stringify(
        inviteUserGroupMembersRequest.users.map((user) => user.alias)
      );
      return services.userGroup
        .findUsersByAliases({
          login,
          uki,
          aliases,
        })
        .then((findUserServiceResponse) => {
          const userGroupMembers = inviteUserGroupMembersRequest.users.map(
            (user) => {
              const baseMember = {
                Alias: user.alias,
                Permission: user.permission,
              };
              const responseUser = findUserServiceResponse[user.alias];
              if (!responseUser) {
                return baseMember;
              }
              const { login, publicKey } = responseUser;
              if (!login || !publicKey) {
                return baseMember;
              }
              return {
                ...baseMember,
                Login: login,
                PublicKey: publicKey,
              };
            }
          );
          const { revision } = inviteUserGroupMembersRequest;
          const userUserGroupAdminItem = getUserGroupAdminItem(
            teamAdminData,
            userGroup.teamId.toString(),
            userGroup.groupId
          );
          if (!userUserGroupAdminItem) {
            throw new Error("USER_GROUP_ADMIN_ITEM_NOT_AVAILABLE");
          }
          return services.userGroup.makeInviteMembersEventAsAdmin(
            userUserGroupAdminItem,
            revision,
            currentUserInfo,
            userGroupMembers
          );
        })
        .then((inviteUserGroupMembersEvent) => {
          return services.userGroup.inviteUserGroupMembers(
            currentUserInfo,
            inviteUserGroupMembersEvent
          );
        });
    })
    .catch((error: Error) => {
      const message = `[SharingController] - inviteUserGroupMembers: ${error}`;
      const augmentedError = new Error(message);
      return reportError(
        "Error while inviteUserGroupMembers",
        augmentedError,
        inviteUserGroupMembersRequest
      );
    })
    .then((reportErr) => {
      return Object.assign(
        {
          refusedMembers: {},
        },
        reportErr
      );
    });
}
export async function revokeUserGroupMembers(
  services: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  revokeUserGroupMembersRequest: RevokeUserGroupMembersRequest
): Promise<RevokeUserGroupMembersResult> {
  try {
    throwIfInvalidRequest(currentUserInfo, revokeUserGroupMembersRequest);
    if (revokeUserGroupMembersRequest.users.length === 0) {
      throw new Error("USERS_NOT_SUPPLIED");
    }
    const { groupId, revision, users } = revokeUserGroupMembersRequest;
    const revokeUserGroupMembersEvent =
      await services.userGroup.makeRevokeMembersEvent(groupId, revision, users);
    const { userGroups } = await services.userGroup.revokeUserGroupMembers(
      currentUserInfo,
      revokeUserGroupMembersEvent
    );
    return { userGroups };
  } catch (error) {
    return reportError(
      "Error while revokeUserGroupMembers",
      error,
      revokeUserGroupMembersRequest
    );
  }
}
function reportError(
  message: string,
  error: Error,
  action: UserGroupRequest
): Promise<CreateUserGroupResult> {
  sendExceptionLog({ error });
  Debugger.log(message, error);
  return Promise.resolve({
    userGroups: [],
    error: {
      message: error.message,
      action,
    },
  });
}
export function extractAliasesFromMembers(members: Member[]): string {
  return JSON.stringify(
    members.map((member: Member) => {
      return member.Alias;
    })
  );
}
export function computeUserGroupMember(
  members: Member[],
  findUserServiceResponse: {
    [key: string]: FindUsersResponse;
  }
): UserGroupMember[] {
  return members.map((member: Member) => {
    const userDetails = findUserServiceResponse[member.Alias];
    if (!userDetails) {
      throw new Error(`User details not found for alias: ${member.Alias}`);
    }
    return {
      Alias: member.Alias,
      Login: findUserServiceResponse[member.Alias].login,
      PublicKey: findUserServiceResponse[member.Alias].publicKey,
      Permission: member.Permission,
    };
  });
}
export interface GetSharingParams {
  itemIds: string[];
  itemGroupIds: string[];
  userGroupIds: string[];
}
export async function getSharedData(
  wsService: WSService,
  login: string,
  uki: string,
  params: GetSharingParams
): Promise<SharingData> {
  if (!(params.itemIds || params.itemGroupIds || params.userGroupIds)) {
    throw new Error("MISSING_PARAMETERS");
  }
  const data: GetSharing = {
    ...params,
    type: "getSharing",
    sharingVersion: 4,
  };
  const {
    itemErrors,
    items,
    itemGroupErrors,
    itemGroups,
    userGroupErrors,
    userGroups,
  } = await wsService.sharing.get(login, uki, data);
  if (itemErrors && itemErrors.length) {
    throw new Error(itemErrors[0].message);
  }
  if (itemGroupErrors && itemGroupErrors.length) {
    throw new Error(itemGroupErrors[0].message);
  }
  if (userGroupErrors && userGroupErrors.length) {
    throw new Error(userGroupErrors[0].message);
  }
  return { items, itemGroups, userGroups };
}
export interface UpdateUserGroupMembersRequest {
  groupId: string;
  revision: number;
  users: UserInvite[];
}
export async function updateUserGroupMembers(
  services: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  updateUserGroupMembersRequest: UpdateUserGroupMembersRequest
): Promise<UpdateUserGroupMembersResult> {
  throwIfInvalidRequest(currentUserInfo, updateUserGroupMembersRequest);
  if (updateUserGroupMembersRequest.users.length === 0) {
    throw new Error("USERS_NOT_SUPPLIED");
  }
  const { login, uki } = currentUserInfo;
  const { groupId, revision, users } = updateUserGroupMembersRequest;
  const aliases = JSON.stringify(users.map((user) => user.alias));
  const findUserServiceResponse =
    await services.userGroup.findExistingUsersByAliases({
      login,
      uki,
      aliases,
    });
  const userGroupMembers = users.map((user) => ({
    Alias: user.alias,
    Login: findUserServiceResponse[user.alias].login,
    PublicKey: findUserServiceResponse[user.alias].publicKey,
    Permission: user.permission,
  }));
  const updateUserGroupUsers = await services.userGroup.makeUpdateMembersEvent(
    groupId,
    revision,
    userGroupMembers
  );
  const { userGroups } = await services.userGroup.updateUserGroupMembers(
    currentUserInfo,
    updateUserGroupUsers
  );
  return { userGroups };
}
export function getFreshUserGroups(
  wsService: WSService,
  currentUserInfo: CurrentUserInfo,
  allUserGroups: UserGroupDownload[]
): Promise<UserGroupDownload[]> {
  const { login, uki } = currentUserInfo;
  const userGroupIds = allUserGroups.map((userGroup) => userGroup.groupId);
  return getSharedData(wsService, login, uki, {
    itemIds: [],
    itemGroupIds: [],
    userGroupIds,
  }).then((result) => {
    return result.userGroups;
  });
}
export function emptySessionResponse(action: any) {
  return Promise.reject({
    error: {
      message: "SESSION_EMPTY",
      action,
    },
  });
}
export async function handleShareItemRequest(
  coreServices: CoreServices,
  itemId: string,
  permission: MemberPermission,
  recipients: Recipient[],
  syncAndRetryOnConflict = true
): Promise<ShareItemResponse> {
  const { storeService, applicationModulesAccess, sessionService, wsService } =
    coreServices;
  const {
    ITEM_DOESNT_EXIST,
    LIMIT_EXCEEDED,
    ITEM_HAS_ATTACHMENTS,
    SHARING_FAILED,
  } = ShareItemFailureReason;
  await sessionService.getInstance().user.requestNewSync(Trigger.Sharing);
  const personalData = storeService.getPersonalData();
  const credential = findDataModelObject(itemId, personalData.credentials);
  const note = personalData.notes.find((p) => p.Id === itemId);
  const secret = personalData.secrets.find((p) => p.Id === itemId);
  const item = credential || note || secret;
  if (!item) {
    return {
      success: false,
      reason: ITEM_DOESNT_EXIST,
    };
  }
  const sharingData = storeService.getSharingData();
  const sharedItemGroup = sharingData.itemGroups.find(
    (iG) => iG && iG.items && !!iG.items.find((i) => i.itemId === itemId)
  );
  const state = storeService.getState();
  const isAllowedToShare = isAllowedToShareSelector(state);
  if (!isAllowedToShare) {
    return {
      success: false,
      reason: LIMIT_EXCEEDED,
    };
  }
  const hasAttachments = item.Attachments && item.Attachments.length > 0;
  if (hasAttachments) {
    return {
      success: false,
      reason: ITEM_HAS_ATTACHMENTS,
    };
  }
  try {
    if (!sharedItemGroup) {
      await shareUnsharedItem(
        applicationModulesAccess,
        storeService,
        wsService,
        item,
        permission,
        recipients
      );
    } else {
      await shareAlreadySharedItem(
        applicationModulesAccess,
        storeService,
        wsService,
        sharedItemGroup,
        permission,
        recipients
      );
    }
  } catch (error) {
    if (syncAndRetryOnConflict && hasItemGroupRevisionConflict(error)) {
      try {
        await sessionService.getInstance().user.requestNewSync(Trigger.Sharing);
        return handleShareItemRequest(
          coreServices,
          itemId,
          permission,
          recipients,
          false
        );
      } catch (retryError) {
        const message = `[SharingController] - handleShareItemRequest (syncAndRetryOnConflict): ${retryError}`;
        const augmentedError = new Error(message);
        Debugger.log("ERROR", augmentedError);
        sendExceptionLog({ error: augmentedError });
        return {
          success: false,
          reason: SHARING_FAILED,
          message: `${augmentedError}`,
        };
      }
    } else {
      const message = `[SharingController] - handleShareItemRequest: ${error}`;
      const augmentedError = new Error(message);
      Debugger.log("ERROR", augmentedError);
      sendExceptionLog({ error: augmentedError });
      return {
        success: false,
        reason: SHARING_FAILED,
        message: `${augmentedError}`,
      };
    }
  }
  sessionService.getInstance().user.requestNewSync(Trigger.Sharing);
  return { success: true };
}
const hasItemGroupRevisionConflict = (error: Error | WSError) => {
  const ITEM_GROUP_REVISION_CONFLICT = "INVALID_ITEM_GROUP_REVISION";
  if (
    "getAdditionalInfo" in error &&
    error.getAdditionalInfo().webServiceSubMessage ===
      ITEM_GROUP_REVISION_CONFLICT
  ) {
    return true;
  }
  return error.message.includes(ITEM_GROUP_REVISION_CONFLICT);
};
