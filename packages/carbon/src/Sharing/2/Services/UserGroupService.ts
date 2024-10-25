const base64 = require("base-64");
import { AdminData, CreateUserGroupRequest } from "@dashlane/communication";
import {
  CreateUserGroupEvent,
  UserGroupKeyItemUpload,
} from "@dashlane/sharing/types/userGroup/createUserGroup";
import { UserUpload } from "@dashlane/sharing/types/createItemGroup";
import { CreateTeamAdminsUserGroupEvent } from "@dashlane/sharing/types/userGroup/createTeamAdminsUserGroup";
import { DeleteUserGroupEvent } from "@dashlane/sharing/types/userGroup/deleteUserGroup";
import { RenameUserGroup } from "@dashlane/sharing/types/userGroup/renameUserGroup";
import { AcceptUserGroup } from "@dashlane/sharing/types/userGroup/acceptUserGroup";
import { RefuseUserGroup } from "@dashlane/sharing/types/userGroup/refuseUserGroup";
import { InviteUserGroupUsers } from "@dashlane/sharing/types/userGroup/inviteUserGroupUsers";
import { RevokeUserGroupUsers } from "@dashlane/sharing/types/userGroup/revokeUserGroupUsers";
import {
  UpdateUserGroupUsers,
  UserUpdate,
} from "@dashlane/sharing/types/userGroup/updateUserGroupUsers";
import {
  ServerResponse,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import { GetSharing } from "@dashlane/sharing/types/getSharing";
import { ICryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import { generateItemUuid } from "Utils/generateItemUuid";
import { UserGroupMember } from "Sharing/2/SharingController";
import { FindUsersRequest, FindUsersResponse } from "Libs/WS/UserAlias";
import { isBase64Encoded } from "Libs/CryptoCenter/Helpers/Helper";
import {
  getAdminDataFromTeamAdminData,
  getSpecialItemGroupFromAdminData,
  getSpecialItemGroupKey,
} from "TeamAdmin/Services/index";
import {
  TeamAdminData,
  UserGroupAdminItem,
} from "Session/Store/teamAdminData/types";
import { CurrentUserInfo } from "Session/utils";
import { WSService } from "Libs/WS/index";
import { WSError } from "Libs/WS/Errors";
import { loadSpecialItemGroup } from "TeamAdmin/Services/UserGroupManagementSetupService/teamAdminData";
import { UserGroupResponse } from "Libs/WS/Sharing/2/PerformUserGroupAction";
import {
  generateProposeSignature,
  isProposeSignatureValid,
  validateProposeSignature,
} from "Sharing/2/Services/utils";
import { sendExceptionLog } from "Logs/Exception";
export interface IUserGroupService {
  makeUserGroupAdminItem: () => Promise<UserGroupAdminItem>;
  makeCreateUserGroupEvent: (
    currentUserInfo: CurrentUserInfo,
    teamAdminData: TeamAdminData,
    createUserGroupRequest: CreateUserGroupRequest,
    userGroupAdminItem: UserGroupAdminItem
  ) => Promise<CreateUserGroupEvent>;
  makeCreateSpecialUserGroupEvent: (
    currentUserInfo: CurrentUserInfo,
    createUserGroupRequest: CreateUserGroupRequest,
    members: UserGroupMember[]
  ) => Promise<CreateTeamAdminsUserGroupEvent>;
  createUserGroup: (
    currentUserInfo: CurrentUserInfo,
    adminData: AdminData,
    createUserGroupEvent: CreateUserGroupEvent | CreateTeamAdminsUserGroupEvent
  ) => Promise<UserGroupResponse>;
  makeDeleteUserGroupEvent: (
    groupId: string,
    revision: number,
    groupKeyItemId?: string,
    specialItemGroupRevision?: number
  ) => Promise<DeleteUserGroupEvent>;
  deleteUserGroup: (
    currentUserInfo: CurrentUserInfo,
    adminData: AdminData,
    deleteUserGroupEvent: DeleteUserGroupEvent
  ) => Promise<UserGroupResponse>;
  makeRenameUserGroupEvent: (
    groupId: string,
    revision: number,
    name: string
  ) => Promise<RenameUserGroup>;
  renameUserGroup: (
    currentUserInfo: CurrentUserInfo,
    renameUserGroupEvent: RenameUserGroup
  ) => Promise<UserGroupResponse>;
  makeAcceptUserGroupEvent: (
    currentUserInfo: CurrentUserInfo,
    userGroup: UserGroupDownload
  ) => Promise<AcceptUserGroup>;
  acceptUserGroup: (
    currentUserInfo: CurrentUserInfo,
    acceptUserGroup: AcceptUserGroup
  ) => Promise<UserGroupResponse>;
  makeRefuseUserGroupEvent: (
    groupId: string,
    revision: number
  ) => Promise<RefuseUserGroup>;
  refuseUserGroup: (
    currentUserInfo: CurrentUserInfo,
    refuseUserGroup: RefuseUserGroup
  ) => Promise<UserGroupResponse>;
  makeInviteMembersEventAsAdmin: (
    userGroupAdminItem: UserGroupAdminItem,
    revision: number,
    currentUserInfo: CurrentUserInfo,
    members: UserGroupMember[]
  ) => Promise<InviteUserGroupUsers>;
  inviteUserGroupMembers: (
    currentUserInfo: CurrentUserInfo,
    inviteUserGroupUsers: InviteUserGroupUsers
  ) => Promise<UserGroupResponse>;
  makeRevokeMembersEvent: (
    groupId: string,
    revision: number,
    members: string[]
  ) => Promise<RevokeUserGroupUsers>;
  revokeUserGroupMembers: (
    currentUserInfo: CurrentUserInfo,
    revokeUserGroupUsers: RevokeUserGroupUsers
  ) => Promise<UserGroupResponse>;
  updateUserGroupMembers: (
    currentUserInfo: CurrentUserInfo,
    updateUserGroupUsers: UpdateUserGroupUsers
  ) => Promise<UserGroupResponse>;
  makeUpdateMembersEvent: (
    groupId: string,
    revision: number,
    members: UserGroupMember[]
  ) => Promise<UpdateUserGroupUsers>;
  makeUpdateMembersWithInviteEvent: (
    groupId: string,
    groupKey: string,
    revision: number,
    members: UserGroupMember[]
  ) => Promise<UpdateUserGroupUsers>;
  findExistingUsersByAliases: (findUsers: FindUsersRequest) => Promise<{
    [key: string]: FindUsersResponse;
  }>;
  findUsersByAliases: (findUsers: FindUsersRequest) => Promise<{
    [key: string]: FindUsersResponse;
  }>;
  isCurrentUserProposeSignatureValid: (
    currentUserInfo: CurrentUserInfo,
    userGroup: UserGroupDownload
  ) => Promise<boolean>;
}
export const SHARING_VERSION = 4;
export const CREATE_USER_GROUP = "createUserGroup";
export const CREATE_TEAM_ADMINS_USER_GROUP = "createTeamAdminsUserGroup";
export const DELETE_USER_GROUP = "deleteUserGroup";
export const RENAME_USER_GROUP = "renameUserGroup";
export const ACCEPT_USER_GROUP = "acceptUserGroup";
export const REFUSE_USER_GROUP = "refuseUserGroup";
export const INVITE_USER_GROUP_USERS = "inviteUserGroupUsers";
export const REVOKE_USER_GROUP_USERS = "revokeUserGroupUsers";
export const UPDATE_USER_GROUP_USERS = "updateUserGroupUsers";
function generateAcceptSignature(
  crypto: ICryptoService,
  privateKey: string,
  groupId: string,
  groupKey: string
): PromiseLike<string> {
  return crypto.asymmetricEncryption.sign(
    privateKey,
    base64.encode(groupId + "-accepted-" + groupKey)
  );
}
export function decryptGroupKey(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  encryptedGroupKey: string
): PromiseLike<string> {
  if (!isBase64Encoded(encryptedGroupKey)) {
    throw new Error("INVALID_GROUP_KEY");
  }
  return crypto.asymmetricEncryption.decrypt(
    currentUserInfo.privateKey,
    encryptedGroupKey
  );
}
export async function makeGroupKeyItem(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  teamAdminData: TeamAdminData,
  teamId: string,
  userGroupAdminItem: UserGroupAdminItem
): Promise<UserGroupKeyItemUpload> {
  const adminData = getAdminDataFromTeamAdminData(teamAdminData, teamId);
  const specialItemGroup = getSpecialItemGroupFromAdminData(adminData);
  const itemGroupRevision = specialItemGroup.revision;
  const rawContent = JSON.stringify(userGroupAdminItem);
  const [rawItemKey, specialItemGroupKey] = await Promise.all([
    crypto.symmetricEncryption.generateNewAESKey(),
    getSpecialItemGroupKey(crypto, currentUserInfo, adminData),
  ]);
  const [content, itemKey] = await Promise.all([
    crypto.symmetricEncryption.encryptAES256(
      rawItemKey,
      base64.encode(rawContent)
    ),
    crypto.symmetricEncryption.encryptAES256(
      specialItemGroupKey,
      base64.encode(rawItemKey)
    ),
  ]);
  return {
    itemId: userGroupAdminItem.itemId,
    itemKey,
    content,
    itemGroupRevision,
  };
}
async function makeCreateTeamAdminsUserGroupEventWithMembers(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  createUserGroupRequest: CreateUserGroupRequest,
  members: UserGroupMember[]
): Promise<CreateTeamAdminsUserGroupEvent> {
  return makeCreateGenericUserGroupEventWithMembers(
    "createTeamAdminsUserGroup",
    crypto,
    currentUserInfo,
    createUserGroupRequest,
    members
  ) as Promise<CreateTeamAdminsUserGroupEvent>;
}
async function makeCreateGenericUserGroupEventWithMembers(
  type: "createUserGroup" | "createTeamAdminsUserGroup",
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  createUserGroupRequest: CreateUserGroupRequest,
  members: UserGroupMember[]
): Promise<CreateUserGroupEvent | CreateTeamAdminsUserGroupEvent> {
  const [keyPairRsa, groupKey] = await Promise.all([
    crypto.asymmetricEncryption.generateRsaKeyPair(),
    crypto.symmetricEncryption.generateNewAESKey(),
  ]);
  const groupId = generateItemUuid();
  const privateKey = await crypto.symmetricEncryption.encryptAES256(
    groupKey,
    base64.encode(keyPairRsa.privateKey)
  );
  const createUserGroupEvent = {
    groupId: groupId,
    name: createUserGroupRequest.name,
    publicKey: keyPairRsa.publicKey,
    privateKey,
    sharingVersion: SHARING_VERSION,
    teamId: createUserGroupRequest.teamId,
    type,
    users: await Promise.all(
      members.map((member) => {
        return createUserUploadEvent(
          crypto,
          member,
          currentUserInfo,
          groupKey,
          groupId
        );
      })
    ),
  };
  return createUserGroupEvent as
    | CreateUserGroupEvent
    | CreateTeamAdminsUserGroupEvent;
}
export async function makeUserGroupAdminItem(
  crypto: ICryptoService
): Promise<UserGroupAdminItem> {
  return {
    itemId: generateItemUuid(),
    groupId: generateItemUuid(),
    groupKey: await crypto.symmetricEncryption.generateNewAESKey(),
  };
}
async function makeCreateUserGroupEvent(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  teamAdminData: TeamAdminData,
  createUserGroupRequest: CreateUserGroupRequest,
  userGroupAdminItem: UserGroupAdminItem
): Promise<CreateUserGroupEvent> {
  const keyPairRsa = await crypto.asymmetricEncryption.generateRsaKeyPair();
  const { teamId, externalId, name } = createUserGroupRequest;
  const createUserGroupEvent = {
    groupId: userGroupAdminItem.groupId,
    name,
    publicKey: keyPairRsa.publicKey,
    privateKey: await crypto.symmetricEncryption.encryptAES256(
      userGroupAdminItem.groupKey,
      base64.encode(keyPairRsa.privateKey)
    ),
    sharingVersion: SHARING_VERSION,
    teamId,
    type: "createUserGroup",
    users: [] as UserUpload[],
    groupKeyItem: await makeGroupKeyItem(
      crypto,
      currentUserInfo,
      teamAdminData,
      teamId.toString(),
      userGroupAdminItem
    ),
    externalId,
  };
  return createUserGroupEvent as CreateUserGroupEvent;
}
async function makeDeleteUserGroupEvent(
  groupId: string,
  revision: number,
  groupKeyItemId?: string,
  specialItemGroupRevision?: number
): Promise<DeleteUserGroupEvent> {
  const event: DeleteUserGroupEvent = {
    type: DELETE_USER_GROUP,
    sharingVersion: SHARING_VERSION,
    groupId,
    revision,
  };
  if (groupKeyItemId && specialItemGroupRevision) {
    event.groupKeyItem = {
      itemId: groupKeyItemId,
      itemGroupRevision: specialItemGroupRevision,
    };
  }
  return event;
}
async function makeRenameUserGroupEvent(
  groupId: string,
  revision: number,
  name: string
): Promise<RenameUserGroup> {
  return {
    type: RENAME_USER_GROUP,
    sharingVersion: SHARING_VERSION,
    groupId,
    revision,
    name,
  };
}
export async function createUserUploadEvent(
  crypto: ICryptoService,
  member: UserGroupMember,
  currentUserInfo: CurrentUserInfo,
  groupKey: string,
  groupId: string
): Promise<UserUpload> {
  const userUpload: UserUpload = await ConvertUserGroupMemberToUserUpload(
    crypto,
    member,
    groupKey
  );
  if (member.Login === currentUserInfo.login) {
    userUpload.acceptSignature = await generateAcceptSignature(
      crypto,
      currentUserInfo.privateKey,
      groupId,
      groupKey
    );
  }
  return userUpload;
}
async function makeBaseInviteMembersEvent(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  groupId: string,
  revision: number,
  members: UserGroupMember[],
  groupKey: string
): Promise<InviteUserGroupUsers> {
  const userPromises = members.map(async (member) => {
    try {
      const user = await createUserUploadEvent(
        crypto,
        member,
        currentUserInfo,
        groupKey,
        groupId
      );
      return { success: true, user };
    } catch (error) {
      const message = `[UserGroupService] - makeBaseInviteMembersEvent: ${error}`;
      const augmentedError = new Error(message);
      sendExceptionLog({ error: augmentedError });
      return { success: false };
    }
  });
  const userResults = await Promise.all(userPromises);
  const users = userResults.filter((res) => res.success).map((res) => res.user);
  return {
    groupId,
    revision,
    sharingVersion: SHARING_VERSION,
    type: INVITE_USER_GROUP_USERS,
    users,
  };
}
function makeInviteMembersEventAsAdmin(
  crypto: ICryptoService,
  userGroupAdminItem: UserGroupAdminItem,
  revision: number,
  currentUserInfo: CurrentUserInfo,
  members: UserGroupMember[]
): Promise<InviteUserGroupUsers> {
  return makeBaseInviteMembersEvent(
    crypto,
    currentUserInfo,
    userGroupAdminItem.groupId,
    revision,
    members,
    userGroupAdminItem.groupKey
  );
}
async function makeRevokeMembersEvent(
  groupId: string,
  revision: number,
  users: string[]
): Promise<RevokeUserGroupUsers> {
  return {
    type: REVOKE_USER_GROUP_USERS,
    sharingVersion: SHARING_VERSION,
    revision,
    groupId,
    users,
  };
}
async function makeUpdateMembersEvent(
  groupId: string,
  revision: number,
  members: UserGroupMember[]
): Promise<UpdateUserGroupUsers> {
  return {
    type: UPDATE_USER_GROUP_USERS,
    sharingVersion: SHARING_VERSION,
    revision,
    groupId,
    users: await Promise.all(
      members.map((member) => {
        return ConvertUserGroupMemberToUserUpdate(member);
      })
    ),
  };
}
async function makeUpdateMembersWithInviteEvent(
  crypto: ICryptoService,
  groupId: string,
  groupKey: string,
  revision: number,
  members: UserGroupMember[]
): Promise<UpdateUserGroupUsers> {
  return {
    type: UPDATE_USER_GROUP_USERS,
    sharingVersion: SHARING_VERSION,
    revision,
    groupId,
    users: await Promise.all(
      members.map((member) => {
        return ConvertUserGroupMemberToUserUpdateWithInvite(
          crypto,
          member,
          groupKey
        );
      })
    ),
  };
}
async function makeAcceptUserGroupEvent(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  userGroup: UserGroupDownload
): Promise<AcceptUserGroup> {
  const encryptedGroupKey = userGroup.users.find(
    (user) => user.userId === currentUserInfo.login
  ).groupKey;
  const groupKey = await decryptGroupKey(
    crypto,
    currentUserInfo,
    encryptedGroupKey
  );
  const acceptSignature = await generateAcceptSignature(
    crypto,
    currentUserInfo.privateKey,
    userGroup.groupId,
    groupKey
  );
  return {
    type: ACCEPT_USER_GROUP,
    sharingVersion: 4,
    revision: userGroup.revision,
    groupId: userGroup.groupId,
    acceptSignature,
  };
}
async function makeRefuseUserGroupEvent(
  groupId: string,
  revision: number
): Promise<RefuseUserGroup> {
  return {
    type: REFUSE_USER_GROUP,
    sharingVersion: 4,
    revision,
    groupId,
  };
}
async function isCurrentUserProposeSignatureValid(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  userGroup: UserGroupDownload
): Promise<boolean> {
  const member = userGroup.users.find(
    (user) => user.userId === currentUserInfo.login
  );
  const groupKey = await decryptGroupKey(
    crypto,
    currentUserInfo,
    member.groupKey
  );
  return isProposeSignatureValid(
    crypto,
    member.proposeSignature,
    member.userId,
    groupKey
  );
}
export async function ConvertUserGroupMemberToUserUpload(
  crypto: ICryptoService,
  userGroupMember: UserGroupMember,
  groupKey: string
): Promise<UserUpload> {
  const userUpdate = await ConvertUserGroupMemberToUserUpdate(userGroupMember);
  if (!userGroupMember.Login) {
    const proposeSignature = await generateProposeSignature(
      crypto,
      groupKey,
      userGroupMember.Alias
    );
    await validateProposeSignature(
      "[ItemGroupService] - ConvertUserGroupMemberToUserUpload (no login)",
      crypto,
      groupKey,
      proposeSignature,
      base64.encode(userGroupMember.Alias)
    );
    return {
      ...userUpdate,
      userId: userGroupMember.Alias,
      alias: userGroupMember.Alias,
      proposeSignatureUsingAlias: true,
      proposeSignature,
    } as UserUpload;
  }
  const [encodedGroupKey, proposeSignature] = await Promise.all([
    crypto.asymmetricEncryption.encrypt(userGroupMember.PublicKey, groupKey),
    generateProposeSignature(crypto, groupKey, userGroupMember.Login),
  ]);
  await validateProposeSignature(
    "[ItemGroupService] - ConvertUserGroupMemberToUserUpload",
    crypto,
    groupKey,
    proposeSignature,
    base64.encode(userGroupMember.Login)
  );
  return {
    ...userUpdate,
    alias: userGroupMember.Alias,
    groupKey: encodedGroupKey,
    proposeSignatureUsingAlias: false,
    proposeSignature,
  } as UserUpload;
}
export async function ConvertUserGroupMemberToUserUpdateWithInvite(
  crypto: ICryptoService,
  userGroupMember: UserGroupMember,
  groupKey: string
): Promise<UserUpload> {
  const userUpdate = await ConvertUserGroupMemberToUserUpdate(userGroupMember);
  const [encodedGroupKey, proposeSignature] = await Promise.all([
    crypto.asymmetricEncryption.encrypt(userGroupMember.PublicKey, groupKey),
    generateProposeSignature(crypto, groupKey, userGroupMember.Login),
  ]);
  await validateProposeSignature(
    "[ItemGroupService] - ConvertUserGroupMemberToUserUpdateWithInvite",
    crypto,
    groupKey,
    proposeSignature,
    base64.encode(userGroupMember.Login)
  );
  return {
    ...userUpdate,
    groupKey: encodedGroupKey,
    proposeSignature,
  } as UserUpload;
}
export async function ConvertUserGroupMemberToUserUpdate(
  userGroupMember: UserGroupMember
): Promise<UserUpdate> {
  return {
    permission: userGroupMember.Permission,
    userId: userGroupMember.Login,
  };
}
export const checkUsersPublicKey = (users: {
  [key: string]: FindUsersResponse;
}): Promise<{
  [key: string]: FindUsersResponse;
}> => {
  const usersWithoutPublicKey = Object.keys(users).filter((user) => {
    return !users[user].publicKey;
  });
  if (usersWithoutPublicKey.length > 0) {
    return Promise.reject(
      new Error(
        JSON.stringify({
          message: "Users missing public Key: " + usersWithoutPublicKey,
          code: "MISSING_PUBLIC_KEY",
        })
      )
    );
  }
  return Promise.resolve(users);
};
function getSharingData(
  getSharing: (
    login: string,
    uki: string,
    getSharingEvent: GetSharing
  ) => Promise<ServerResponse>,
  login: string,
  uki: string,
  groupIds: string[]
): Promise<UserGroupDownload[]> {
  const data: GetSharing = {
    type: "getSharing",
    sharingVersion: 4,
    userGroupIds: groupIds,
  };
  return getSharing(login, uki, data).then(
    ({ userGroupErrors, userGroups }) => {
      if (userGroupErrors && userGroupErrors.length) {
        throw new Error(userGroupErrors[0].message);
      }
      return userGroups;
    }
  );
}
interface Event extends Object {
  groupId: string;
  revision: number;
}
function validateUserGroup({ teamId }: UserGroupDownload) {
  if (!teamId) {
    throw new Error("USER_GROUP_DELETED");
  }
}
const hasGroupConflict = (error: Error | WSError) => {
  const GROUP_ADD_DELETE_CONFLICT_MESSAGE = "ITEM_GROUP_UPDATE_CONFLICT";
  if (
    "getAdditionalInfo" in error &&
    error.getAdditionalInfo().webServiceSubMessage ===
      GROUP_ADD_DELETE_CONFLICT_MESSAGE
  ) {
    return true;
  }
  return error.message.includes(GROUP_ADD_DELETE_CONFLICT_MESSAGE);
};
const hasUserConflict = (error: Error | WSError) => {
  const USER_ADD_DELETE_CONFLICT_MESSAGE = "Conflict";
  if (
    "getAdditionalInfo" in error &&
    error
      .getAdditionalInfo()
      .message.startsWith(USER_ADD_DELETE_CONFLICT_MESSAGE)
  ) {
    return true;
  }
  return error.message.startsWith(USER_ADD_DELETE_CONFLICT_MESSAGE);
};
function performUserGroupAction(
  action: (
    login: string,
    uki: string,
    event: Event
  ) => Promise<UserGroupResponse>,
  getSharing: (
    login: string,
    uki: string,
    getSharingEvent: GetSharing
  ) => Promise<ServerResponse>,
  login: string,
  uki: string,
  event: Event
): Promise<UserGroupResponse> {
  return action(login, uki, event).catch((error) => {
    if (hasGroupConflict(error)) {
      return getSharingData(getSharing, login, uki, [event.groupId]).then(
        ([userGroup]) => {
          validateUserGroup(userGroup);
          const { revision } = userGroup;
          return action(login, uki, { ...event, revision });
        }
      );
    }
    throw error;
  });
}
function createUserGroup(
  wsService: WSService,
  login: string,
  uki: string,
  adminData: AdminData,
  event: CreateUserGroupEvent
): Promise<UserGroupResponse> {
  return wsService.userGroup.create(login, uki, event).catch((error) => {
    if (hasGroupConflict(error)) {
      return loadSpecialItemGroup(wsService, login, uki, adminData).then(
        (specialItemGroup) => {
          return wsService.userGroup.create(login, uki, {
            ...event,
            groupKeyItem: {
              ...event.groupKeyItem,
              itemGroupRevision: specialItemGroup.revision,
            },
          });
        }
      );
    }
    throw error;
  });
}
function deleteUserGroup(
  wsService: WSService,
  login: string,
  uki: string,
  adminData: AdminData,
  event: DeleteUserGroupEvent
): Promise<UserGroupResponse> {
  return wsService.userGroup.delete(login, uki, event).catch((error) => {
    if (hasGroupConflict(error)) {
      return loadSpecialItemGroup(wsService, login, uki, adminData).then(
        (specialItemGroup) => {
          return wsService.userGroup.delete(login, uki, {
            ...event,
            groupKeyItem: {
              ...event.groupKeyItem,
              itemGroupRevision: specialItemGroup.revision,
            },
          });
        }
      );
    } else if (hasUserConflict(error)) {
      return getSharingData(wsService.sharing.get, login, uki, [
        event.groupId,
      ]).then((userGroups) => {
        const [{ revision, teamId }] = userGroups;
        if (!teamId) {
          return { userGroups };
        }
        return wsService.userGroup.delete(login, uki, {
          ...event,
          revision,
        });
      });
    }
    throw error;
  });
}
function renameUserGroup(
  wsService: WSService,
  login: string,
  uki: string,
  event: RenameUserGroup
): Promise<UserGroupResponse> {
  const doRename = wsService.userGroup.rename;
  return doRename(login, uki, event).catch((error) => {
    if (hasUserConflict(error)) {
      return getSharingData(wsService.sharing.get, login, uki, [
        event.groupId,
      ]).then((userGroups) => {
        validateUserGroup(userGroups[0]);
        const [{ name, revision }] = userGroups;
        if (name === event.name) {
          return { userGroups };
        }
        return doRename(login, uki, { ...event, revision });
      });
    }
    throw error;
  });
}
function revokeUserGroupMembers(
  wsService: WSService,
  login: string,
  uki: string,
  event: RevokeUserGroupUsers
): Promise<UserGroupResponse> {
  return wsService.userGroup.revoke(login, uki, event).catch((error) => {
    if (hasUserConflict(error)) {
      return getSharingData(wsService.sharing.get, login, uki, [
        event.groupId,
      ]).then((userGroups) => {
        validateUserGroup(userGroups[0]);
        const [{ revision, users }] = userGroups;
        const usersToRevoke = event.users.filter((userId) =>
          users.find((u) => u.userId === userId && u.status === "accepted")
        );
        if (!usersToRevoke.length) {
          return { userGroups };
        }
        return wsService.userGroup.revoke(login, uki, {
          ...event,
          revision,
          users: usersToRevoke,
        });
      });
    }
    throw error;
  });
}
function inviteUserGroupMembers(
  wsService: WSService,
  login: string,
  uki: string,
  event: InviteUserGroupUsers
): Promise<UserGroupResponse> {
  return wsService.userGroup.invite(login, uki, event).catch((error) => {
    if (hasUserConflict(error)) {
      return getSharingData(wsService.sharing.get, login, uki, [
        event.groupId,
      ]).then((userGroups) => {
        validateUserGroup(userGroups[0]);
        const [{ revision, users }] = userGroups;
        const inviteUsers = event.users.filter(
          (user) =>
            !users.find(
              (u) => u.userId === user.userId && u.status === "accepted"
            )
        );
        if (!inviteUsers.length) {
          return { userGroups };
        }
        return wsService.userGroup.invite(login, uki, {
          ...event,
          revision,
          users: inviteUsers,
        });
      });
    }
    throw error;
  });
}
export function makeUserGroupService(
  wsService: WSService,
  crypto: ICryptoService
): IUserGroupService {
  return {
    makeUserGroupAdminItem: (): Promise<UserGroupAdminItem> =>
      makeUserGroupAdminItem(crypto),
    makeCreateUserGroupEvent: (
      currentUserInfo: CurrentUserInfo,
      teamAdminData: TeamAdminData,
      createUserGroupRequest: CreateUserGroupRequest,
      userGroupAdminItem: UserGroupAdminItem
    ): Promise<CreateUserGroupEvent> => {
      return makeCreateUserGroupEvent(
        crypto,
        currentUserInfo,
        teamAdminData,
        createUserGroupRequest,
        userGroupAdminItem
      );
    },
    makeCreateSpecialUserGroupEvent: (
      currentUserInfo: CurrentUserInfo,
      createUserGroupRequest: CreateUserGroupRequest,
      members: UserGroupMember[]
    ): Promise<CreateTeamAdminsUserGroupEvent> => {
      return makeCreateTeamAdminsUserGroupEventWithMembers(
        crypto,
        currentUserInfo,
        createUserGroupRequest,
        members
      );
    },
    createUserGroup: (
      { login, uki }: CurrentUserInfo,
      adminData: AdminData,
      createUserGroupEvent: CreateUserGroupEvent
    ): Promise<UserGroupResponse> => {
      return createUserGroup(
        wsService,
        login,
        uki,
        adminData,
        createUserGroupEvent
      );
    },
    makeDeleteUserGroupEvent: (
      groupId: string,
      revision: number,
      groupKeyItemId?: string,
      specialItemGroupRevision?: number
    ): Promise<DeleteUserGroupEvent> => {
      return makeDeleteUserGroupEvent(
        groupId,
        revision,
        groupKeyItemId,
        specialItemGroupRevision
      );
    },
    deleteUserGroup: (
      { login, uki }: CurrentUserInfo,
      adminData: AdminData,
      deleteUserGroupEvent: DeleteUserGroupEvent
    ): Promise<UserGroupResponse> => {
      return deleteUserGroup(
        wsService,
        login,
        uki,
        adminData,
        deleteUserGroupEvent
      );
    },
    makeRenameUserGroupEvent: (
      groupId: string,
      revision: number,
      name: string
    ): Promise<RenameUserGroup> => {
      return makeRenameUserGroupEvent(groupId, revision, name);
    },
    renameUserGroup: (
      { login, uki }: CurrentUserInfo,
      renameUserGroupEvent: RenameUserGroup
    ): Promise<UserGroupResponse> => {
      return renameUserGroup(wsService, login, uki, renameUserGroupEvent);
    },
    makeAcceptUserGroupEvent: (
      currentUserInfo: CurrentUserInfo,
      userGroup: UserGroupDownload
    ): Promise<AcceptUserGroup> => {
      return makeAcceptUserGroupEvent(crypto, currentUserInfo, userGroup);
    },
    acceptUserGroup: (
      { login, uki }: CurrentUserInfo,
      acceptUserGroup: AcceptUserGroup
    ): Promise<UserGroupResponse> => {
      return performUserGroupAction(
        wsService.userGroup.accept,
        wsService.sharing.get,
        login,
        uki,
        acceptUserGroup
      );
    },
    makeRefuseUserGroupEvent: (
      groupId: string,
      revision: number
    ): Promise<RefuseUserGroup> => {
      return makeRefuseUserGroupEvent(groupId, revision);
    },
    refuseUserGroup: (
      { login, uki }: CurrentUserInfo,
      refuseUserGroup: RefuseUserGroup
    ): Promise<UserGroupResponse> => {
      return performUserGroupAction(
        wsService.userGroup.refuse,
        wsService.sharing.get,
        login,
        uki,
        refuseUserGroup
      );
    },
    makeInviteMembersEventAsAdmin: (
      userGroupAdminItem: UserGroupAdminItem,
      revision: number,
      currentUserInfo: CurrentUserInfo,
      members: UserGroupMember[]
    ): Promise<InviteUserGroupUsers> => {
      return makeInviteMembersEventAsAdmin(
        crypto,
        userGroupAdminItem,
        revision,
        currentUserInfo,
        members
      );
    },
    inviteUserGroupMembers: (
      { login, uki }: CurrentUserInfo,
      inviteUserGroupUsers: InviteUserGroupUsers
    ): Promise<UserGroupResponse> => {
      return inviteUserGroupMembers(
        wsService,
        login,
        uki,
        inviteUserGroupUsers
      );
    },
    makeRevokeMembersEvent: (
      groupId,
      revision,
      members
    ): Promise<RevokeUserGroupUsers> => {
      return makeRevokeMembersEvent(groupId, revision, members);
    },
    revokeUserGroupMembers: (
      { login, uki }: CurrentUserInfo,
      revokeUserGroupUsers: RevokeUserGroupUsers
    ): Promise<UserGroupResponse> => {
      return revokeUserGroupMembers(
        wsService,
        login,
        uki,
        revokeUserGroupUsers
      );
    },
    makeUpdateMembersEvent: (
      groupId: string,
      revision: number,
      members: UserGroupMember[]
    ): Promise<UpdateUserGroupUsers> => {
      return makeUpdateMembersEvent(groupId, revision, members);
    },
    makeUpdateMembersWithInviteEvent: (
      groupId: string,
      groupKey: string,
      revision: number,
      members: UserGroupMember[]
    ): Promise<UpdateUserGroupUsers> => {
      return makeUpdateMembersWithInviteEvent(
        crypto,
        groupId,
        groupKey,
        revision,
        members
      );
    },
    updateUserGroupMembers: (
      { login, uki }: CurrentUserInfo,
      updateUserGroupUsers: UpdateUserGroupUsers
    ): Promise<UserGroupResponse> => {
      return performUserGroupAction(
        wsService.userGroup.update,
        wsService.sharing.get,
        login,
        uki,
        updateUserGroupUsers
      );
    },
    findExistingUsersByAliases: (
      findUsers: FindUsersRequest
    ): Promise<{
      [key: string]: FindUsersResponse;
    }> => {
      return wsService.userAlias
        .findUsersByAliases(findUsers)
        .then(checkUsersPublicKey);
    },
    findUsersByAliases: (
      findUsers: FindUsersRequest
    ): Promise<{
      [key: string]: FindUsersResponse;
    }> => {
      return wsService.userAlias.findUsersByAliases(findUsers);
    },
    isCurrentUserProposeSignatureValid: (
      currentUserInfo: CurrentUserInfo,
      userGroup: UserGroupDownload
    ): Promise<boolean> => {
      return isCurrentUserProposeSignatureValid(
        crypto,
        currentUserInfo,
        userGroup
      );
    },
  };
}
