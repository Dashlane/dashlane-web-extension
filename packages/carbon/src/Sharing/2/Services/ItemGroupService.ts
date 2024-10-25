import { CreateUserGroupsItemGroupEvent } from "@dashlane/sharing/types/createUserGroupsItemGroup";
import {
  AcceptItemGroup,
  ItemforEmailing,
} from "@dashlane/sharing/types/acceptItemGroup";
import { RefuseItemGroup } from "@dashlane/sharing/types/refuseItemGroup";
import {
  CreateItemGroupEvent,
  ItemUpload,
  UserGroupInvite,
  UserUpload,
} from "@dashlane/sharing/types/createItemGroup";
import {
  InviteItemGroupMembers,
  UserInvite,
} from "@dashlane/sharing/types/inviteItemGroupMembers";
import { DeleteItemGroupEvent } from "@dashlane/sharing/types/deleteItemGroup";
import {
  ItemGroupDownload,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import { GetSharing } from "@dashlane/sharing/types/getSharing";
import { MemberPermission } from "@dashlane/communication";
import {
  UpdateItemGroupMembers,
  UserGroupUpdate,
  UserUpdate,
} from "@dashlane/sharing/types/updateItemGroupMembers";
import { WSService } from "Libs/WS/index";
import { ICryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import { generateItemUuid } from "Utils/generateItemUuid";
import { CurrentUserInfo } from "Session/utils";
import { UserGroupAdminItem } from "Session/Store/teamAdminData/types";
import { createItemsForUserGroups } from "TeamAdmin/Services/UserGroupManagementSetupService/migrate";
import {
  generateAcceptSignature,
  generateProposeSignature,
  validateProposeSignature,
} from "Sharing/2/Services/utils";
import { makeCryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import { getUserGroupPrivateKey } from "Sharing/2/Services/SharingHelpers";
import {
  RevokeActionOrigin,
  RevokeItemGroupMembersWithOrigin,
} from "Libs/WS/Sharing/2/types";
const base64 = require("base-64");
export interface UserUploadUser {
  login: string;
  publicKey: string;
  privateKey?: string;
}
export interface AuditLogDetails {
  captureLog: boolean;
  domain?: string;
  type: "AUTHENTIFIANT" | "SECURENOTE" | "SECRET";
}
export interface IItemGroupService {
  makeCreateSpecialItemGroupEvent: (
    currentUserInfo: CurrentUserInfo,
    specialUserGroup: UserGroupDownload,
    userGroupAdminItems: UserGroupAdminItem[]
  ) => Promise<CreateUserGroupsItemGroupEvent>;
  makeCreateItemGroupEvent: (
    groupId: string,
    users: UserUpload[],
    groups: UserGroupInvite[],
    items: ItemUpload[],
    itemsForEmailing: ItemforEmailing[],
    auditLogDetails: AuditLogDetails
  ) => CreateItemGroupEvent;
  makeInviteItemGroupMembers: (
    groupId: string,
    revision: number,
    users: UserInvite[],
    groups: UserGroupInvite[],
    itemsForEmailing: ItemforEmailing[],
    auditLogDetails: AuditLogDetails
  ) => InviteItemGroupMembers;
  makeUserUpload: (
    alias: string,
    user: UserUploadUser,
    groupId: string,
    permission: MemberPermission,
    rawItemGroupKey: string
  ) => Promise<UserUpload>;
  makeUpdateItemGroupMembers: (
    groupId: string,
    revision: number,
    users: UserUpdate[],
    groups: UserGroupUpdate[]
  ) => UpdateItemGroupMembers;
  makeUserUpdate: (
    userId: string,
    permission: MemberPermission,
    publicKeyData?: {
      rawItemGroupKey: string;
      userPublicKey: string;
    }
  ) => Promise<UserUpdate>;
  makeUserGroupUpdate: (
    groupId: string,
    permission: MemberPermission
  ) => UserGroupUpdate;
  makeUserGroupInvite: (
    userGroup: UserGroupDownload,
    permission: MemberPermission,
    rawItemGroupKey: string,
    privateKey: string,
    myUserId: string,
    itemGroupId: string
  ) => Promise<UserGroupInvite>;
  createSpecialItemGroup: (
    currentUserInfo: CurrentUserInfo,
    createItemGroupEvent: CreateUserGroupsItemGroupEvent
  ) => Promise<ItemGroupDownload>;
  makeDeleteItemGroupEvent: (
    groupId: string,
    revision: number
  ) => Promise<DeleteItemGroupEvent>;
  deleteItemGroup: (
    currentUserInfo: CurrentUserInfo,
    deleteItemGroupEvent: DeleteItemGroupEvent
  ) => Promise<ItemGroupDownload[]>;
  makeAcceptItemGroupEvent: (
    acceptSignature: string,
    groupId: string,
    revision: number,
    itemsForEmailing: ItemforEmailing[],
    auditLogDetails: AuditLogDetails,
    userGroupId?: string
  ) => AcceptItemGroup & {
    auditLogDetails: AuditLogDetails;
  };
  makeRefuseItemGroupEvent: (
    groupId: string,
    revision: number,
    itemsForEmailing: ItemforEmailing[],
    auditLogDetails?: AuditLogDetails,
    userGroupId?: string
  ) => RefuseItemGroup & {
    auditLogDetails: AuditLogDetails;
  };
  makeRevokeItemGroupMembers: (
    groupId: string,
    revision: number,
    users: string[],
    groups: string[],
    auditLogDetails: AuditLogDetails,
    origin?: RevokeActionOrigin
  ) => RevokeItemGroupMembersWithOrigin & {
    auditLogDetails: AuditLogDetails;
  };
}
export const ACCEPT_ITEM_GROUP = "acceptItemGroup";
export const CREATE_ITEM_GROUP = "createItemGroup";
export const CREATE_SPECIAL_ITEM_GROUP = "createUserGroupsItemGroup";
export const DELETE_ITEM_GROUP = "deleteItemGroup";
export const INVITE_ITEM_GROUP_MEMBERS = "inviteItemGroupMembers";
export const REFUSE_ITEM_GROUP = "refuseItemGroup";
export const REVOKE_ITEM_GROUP_MEMBERS = "revokeItemGroupMembers";
export const SHARING_VERSION = 4;
export const UPDATE_ITEM_GROUP_MEMBERS = "updateItemGroupMembers";
function getDecodedUserGroupKeyForCurrentUser(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  userGroup: UserGroupDownload
) {
  const specialUserGroupMember =
    userGroup &&
    userGroup.users &&
    userGroup.users.find((user) => user.userId === currentUserInfo.login);
  const encodedGroupKey =
    specialUserGroupMember && specialUserGroupMember.groupKey;
  return crypto.asymmetricEncryption.decrypt(
    currentUserInfo.privateKey,
    encodedGroupKey
  );
}
async function makeCreateSpecialItemGroupEvent(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  specialUserGroup: UserGroupDownload,
  userGroupAdminItems: UserGroupAdminItem[]
): Promise<CreateUserGroupsItemGroupEvent> {
  const itemGroupId = generateItemUuid();
  const [itemGroupKey, decryptedSpecialUserGroupKey] = await Promise.all([
    crypto.symmetricEncryption.generateNewAESKey(),
    getDecodedUserGroupKeyForCurrentUser(
      crypto,
      currentUserInfo,
      specialUserGroup
    ),
  ]);
  const decryptedUserGroupPrivateKey =
    await crypto.symmetricEncryption.decryptAES256(
      decryptedSpecialUserGroupKey,
      specialUserGroup.privateKey
    );
  const [encryptedItemGroupKey, proposeSignature, acceptSignature] =
    await Promise.all([
      crypto.asymmetricEncryption.encrypt(
        specialUserGroup.publicKey,
        itemGroupKey
      ),
      generateProposeSignature(crypto, itemGroupKey, specialUserGroup.groupId),
      generateAcceptSignature(
        crypto,
        decryptedUserGroupPrivateKey,
        itemGroupId,
        itemGroupKey
      ),
    ]);
  const createItemGroupEvent: CreateUserGroupsItemGroupEvent = {
    type: CREATE_SPECIAL_ITEM_GROUP,
    sharingVersion: SHARING_VERSION,
    groupId: itemGroupId,
    teamId: specialUserGroup.teamId,
    alias: currentUserInfo.login,
    groups: [
      {
        groupId: specialUserGroup.groupId,
        permission: "admin",
        groupKey: encryptedItemGroupKey,
        proposeSignature,
        acceptSignature,
      },
    ],
  };
  if (userGroupAdminItems.length) {
    createItemGroupEvent.items = await createItemsForUserGroups(
      crypto,
      itemGroupKey,
      userGroupAdminItems
    );
  }
  return createItemGroupEvent;
}
function getSharingData(
  wsService: WSService,
  login: string,
  uki: string,
  groupIds: string[]
): Promise<ItemGroupDownload[]> {
  const data: GetSharing = {
    type: "getSharing",
    sharingVersion: 4,
    userGroupIds: groupIds,
  };
  return wsService.sharing
    .get(login, uki, data)
    .then(({ itemGroupErrors, itemGroups }) => {
      if (itemGroupErrors && itemGroupErrors.length) {
        throw new Error(itemGroupErrors[0].message);
      }
      return itemGroups;
    });
}
async function makeDeleteItemGroupEvent(
  groupId: string,
  revision: number
): Promise<DeleteItemGroupEvent> {
  return {
    type: DELETE_ITEM_GROUP,
    sharingVersion: SHARING_VERSION,
    groupId,
    revision,
  };
}
function deleteItemGroup(
  wsService: WSService,
  login: string,
  uki: string,
  event: DeleteItemGroupEvent
): Promise<ItemGroupDownload[]> {
  return wsService.itemGroup
    .deleteGroup(login, uki, event)
    .then(({ itemGroups }) => itemGroups)
    .catch((error) => {
      if (error.message === "Conflict") {
        return getSharingData(wsService, login, uki, [event.groupId]).then(
          (itemGroups) => {
            const [{ revision, teamId }] = itemGroups;
            if (!teamId) {
              return itemGroups;
            }
            return wsService.itemGroup
              .deleteGroup(login, uki, { ...event, revision })
              .then(({ itemGroups }) => itemGroups);
          }
        );
      }
      throw error;
    });
}
function makeAcceptItemGroupEvent(
  acceptSignature: string,
  groupId: string,
  revision: number,
  itemsForEmailing: ItemforEmailing[],
  auditLogDetails: AuditLogDetails,
  userGroupId?: string
): AcceptItemGroup & {
  auditLogDetails: AuditLogDetails;
} {
  const userGroupIdMerge = userGroupId ? { userGroupId } : {};
  const itemsForEmailingMerge =
    itemsForEmailing && itemsForEmailing.length ? { itemsForEmailing } : {};
  const auditLogDetailsStrict = auditLogDetails ? auditLogDetails : undefined;
  return {
    ...userGroupIdMerge,
    ...itemsForEmailingMerge,
    acceptSignature,
    groupId,
    revision,
    sharingVersion: SHARING_VERSION,
    type: ACCEPT_ITEM_GROUP,
    auditLogDetails: auditLogDetailsStrict,
  };
}
function makeRefuseItemGroupEvent(
  groupId: string,
  revision: number,
  itemsForEmailing: ItemforEmailing[],
  auditLogDetails?: AuditLogDetails,
  userGroupId?: string
): RefuseItemGroup & {
  auditLogDetails: AuditLogDetails;
} {
  const userGroupIdMerge = userGroupId ? { userGroupId } : {};
  const itemsForEmailingMerge =
    itemsForEmailing && itemsForEmailing.length ? { itemsForEmailing } : {};
  const auditLogDetailsStrict = auditLogDetails ? auditLogDetails : undefined;
  return {
    ...itemsForEmailingMerge,
    ...userGroupIdMerge,
    groupId,
    revision,
    sharingVersion: SHARING_VERSION,
    type: REFUSE_ITEM_GROUP,
    auditLogDetails: auditLogDetailsStrict,
  };
}
function makeCreateItemGroupEvent(
  groupId: string,
  users: UserUpload[],
  groups: UserGroupInvite[],
  items: ItemUpload[],
  itemsForEmailing: ItemforEmailing[],
  auditLogDetails: AuditLogDetails
): CreateItemGroupEvent & {
  auditLogDetails: AuditLogDetails;
} {
  const groupsMerge = groups && groups.length ? { groups } : {};
  const itemsForEmailingMerge =
    itemsForEmailing && itemsForEmailing.length ? { itemsForEmailing } : {};
  const auditLogDetailsStrict = auditLogDetails ? auditLogDetails : undefined;
  return {
    ...groupsMerge,
    ...itemsForEmailingMerge,
    groupId,
    items,
    sharingVersion: SHARING_VERSION,
    type: CREATE_ITEM_GROUP,
    users,
    auditLogDetails: auditLogDetailsStrict,
  };
}
function makeInviteItemGroupMembers(
  groupId: string,
  revision: number,
  users: UserInvite[],
  groups: UserGroupInvite[],
  itemsForEmailing: ItemforEmailing[],
  auditLogDetails: AuditLogDetails
): InviteItemGroupMembers & {
  auditLogDetails: AuditLogDetails;
} {
  const groupsMerge = groups && groups.length ? { groups } : {};
  const usersMerge = users && users.length ? { users } : {};
  const itemsForEmailingMerge =
    itemsForEmailing && itemsForEmailing.length ? { itemsForEmailing } : {};
  const auditLogDetailsStrict = auditLogDetails ? auditLogDetails : undefined;
  return {
    ...groupsMerge,
    ...usersMerge,
    ...itemsForEmailingMerge,
    revision,
    groupId,
    sharingVersion: SHARING_VERSION,
    type: INVITE_ITEM_GROUP_MEMBERS,
    auditLogDetails: auditLogDetailsStrict,
  };
}
function makeRevokeItemGroupMembers(
  groupId: string,
  revision: number,
  users: string[],
  groups: string[],
  auditLogDetails: AuditLogDetails,
  origin: RevokeActionOrigin = "manual"
): RevokeItemGroupMembersWithOrigin & {
  auditLogDetails: AuditLogDetails;
} {
  const groupsMerge = groups && groups.length ? { groups } : {};
  const usersMerge = users && users.length ? { users } : {};
  const auditLogDetailsStrict = auditLogDetails ? auditLogDetails : undefined;
  return {
    ...groupsMerge,
    ...usersMerge,
    groupId,
    revision,
    sharingVersion: SHARING_VERSION,
    type: REVOKE_ITEM_GROUP_MEMBERS,
    auditLogDetails: auditLogDetailsStrict,
    origin,
  };
}
function makeUpdateItemGroupMembers(
  groupId: string,
  revision: number,
  users: UserUpdate[],
  groups: UserGroupUpdate[]
): UpdateItemGroupMembers {
  const groupsMerge = groups && groups.length ? { groups } : {};
  const usersMerge = users && users.length ? { users } : {};
  return {
    ...groupsMerge,
    ...usersMerge,
    groupId,
    revision,
    sharingVersion: SHARING_VERSION,
    type: UPDATE_ITEM_GROUP_MEMBERS,
  };
}
async function makeUserUpdate(
  userId: string,
  permission: MemberPermission,
  publicKeyData?: {
    rawItemGroupKey: string;
    userPublicKey: string;
  }
): Promise<UserUpdate> {
  const publicKeyMerge = publicKeyData
    ? await makeUserUpdatePublicKey(
        userId,
        publicKeyData.rawItemGroupKey,
        publicKeyData.userPublicKey
      )
    : {};
  return {
    ...publicKeyMerge,
    permission,
    userId,
  };
}
async function makeUserUpdatePublicKey(
  userId: string,
  rawItemGroupKey: string,
  userPublicKey: string
): Promise<{
  groupKey: string;
  proposeSignature: string;
}> {
  const crypto = await makeCryptoService();
  const proposeSignatureData = base64.encode(userId);
  const proposeSignature = await crypto.symmetricEncryption.signHmacSHA256(
    rawItemGroupKey,
    proposeSignatureData
  );
  await validateProposeSignature(
    "[ItemGroupService] - makeUserUpdatePublicKey",
    crypto,
    rawItemGroupKey,
    proposeSignature,
    proposeSignatureData
  );
  const groupKey = await crypto.asymmetricEncryption.encrypt(
    userPublicKey,
    rawItemGroupKey
  );
  return { groupKey, proposeSignature };
}
function makeUserGroupUpdate(
  groupId: string,
  permission: MemberPermission
): UserGroupUpdate {
  return { permission, groupId };
}
async function makeUserUpload(
  alias: string,
  user: UserUploadUser,
  groupId: string,
  permission: MemberPermission,
  rawItemGroupKey: string
): Promise<UserUpload & UserInvite> {
  const crypto = await makeCryptoService();
  const userFound = user && user.login && user.publicKey;
  const resolvedUserId = userFound ? user.login : alias;
  const usingAlias = userFound ? {} : { proposeSignatureUsingAlias: true };
  const groupKey = userFound
    ? {
        groupKey: await crypto.asymmetricEncryption.encrypt(
          user.publicKey,
          rawItemGroupKey
        ),
      }
    : {};
  const proposeSignatureData = base64.encode(resolvedUserId);
  const proposeSignature = await crypto.symmetricEncryption.signHmacSHA256(
    rawItemGroupKey,
    proposeSignatureData
  );
  await validateProposeSignature(
    "[ItemGroupService] - makeUserUpload",
    crypto,
    rawItemGroupKey,
    proposeSignature,
    proposeSignatureData
  );
  const acceptSignature = user.privateKey
    ? {
        acceptSignature: await makeAcceptSignature(
          groupId,
          rawItemGroupKey,
          user.privateKey
        ),
      }
    : {};
  return {
    ...acceptSignature,
    ...usingAlias,
    ...groupKey,
    alias,
    permission,
    proposeSignature,
    userId: resolvedUserId,
  };
}
async function makeUserGroupInvite(
  userGroup: UserGroupDownload,
  permission: MemberPermission,
  rawItemGroupKey: string,
  privateKey: string,
  myUserId: string,
  itemGroupId: string
): Promise<UserGroupInvite> {
  const { groupId: userGroupId } = userGroup;
  const crypto = await makeCryptoService();
  const meInUserGroup = (userGroup.users || []).find(
    (u) => u.userId === myUserId
  );
  const message =
    "Trying to share an item to a userGroup that I'm not part of.";
  if (!meInUserGroup) {
    throw new Error(`[ItemGroupService] - makeUserGroupInvite: ${message}`);
  }
  const userGroupPrivateKey = await getUserGroupPrivateKey(
    userGroup,
    privateKey,
    myUserId
  );
  const encryptedItemGroupKey = await crypto.asymmetricEncryption.encrypt(
    userGroup.publicKey,
    rawItemGroupKey
  );
  const proposeSignatureData = base64.encode(userGroupId);
  const proposeSignature = await crypto.symmetricEncryption.signHmacSHA256(
    rawItemGroupKey,
    proposeSignatureData
  );
  await validateProposeSignature(
    "[ItemGroupService] - makeUserGroupInvite",
    crypto,
    rawItemGroupKey,
    proposeSignature,
    proposeSignatureData
  );
  const acceptSignature = await makeAcceptSignature(
    itemGroupId,
    rawItemGroupKey,
    userGroupPrivateKey
  );
  return {
    groupId: userGroupId,
    permission,
    groupKey: encryptedItemGroupKey,
    proposeSignature,
    acceptSignature,
  };
}
async function makeAcceptSignature(
  groupId: string,
  itemGroupKey: string,
  privateKey: string
): Promise<string> {
  const crypto = await makeCryptoService();
  const acceptSignatureData = base64.encode(
    `${groupId}-accepted-${itemGroupKey}`
  );
  return await crypto.asymmetricEncryption.sign(
    privateKey,
    acceptSignatureData
  );
}
export function makeItemGroupService(
  wsService: WSService,
  crypto: ICryptoService
): IItemGroupService {
  return {
    makeCreateSpecialItemGroupEvent: (
      currentUserInfo: CurrentUserInfo,
      specialUserGroup: UserGroupDownload,
      userGroupAdminItems: UserGroupAdminItem[]
    ): Promise<CreateUserGroupsItemGroupEvent> => {
      return makeCreateSpecialItemGroupEvent(
        crypto,
        currentUserInfo,
        specialUserGroup,
        userGroupAdminItems
      );
    },
    makeCreateItemGroupEvent,
    makeInviteItemGroupMembers,
    makeUpdateItemGroupMembers,
    makeUserUpdate,
    makeUserGroupUpdate,
    makeUserUpload,
    makeUserGroupInvite,
    createSpecialItemGroup: (
      { login, uki }: CurrentUserInfo,
      createItemGroupEvent: CreateUserGroupsItemGroupEvent
    ): Promise<ItemGroupDownload> => {
      return wsService.itemGroup.createSpecialItemGroup(
        login,
        uki,
        createItemGroupEvent
      );
    },
    makeDeleteItemGroupEvent: (
      groupId: string,
      revision: number
    ): Promise<DeleteItemGroupEvent> => {
      return makeDeleteItemGroupEvent(groupId, revision);
    },
    deleteItemGroup: (
      { login, uki }: CurrentUserInfo,
      deleteItemGroupEvent: DeleteItemGroupEvent
    ): Promise<ItemGroupDownload[]> => {
      return deleteItemGroup(wsService, login, uki, deleteItemGroupEvent);
    },
    makeAcceptItemGroupEvent,
    makeRefuseItemGroupEvent,
    makeRevokeItemGroupMembers,
  };
}
