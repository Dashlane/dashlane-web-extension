import {
  ApplicationModulesAccess,
  Credential,
  isGroupRecipient,
  isUserRecipient,
  MemberPermission,
  Note,
  Recipient,
  Secret,
} from "@dashlane/communication";
import {
  ItemGroupDownload,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import { StoreService } from "Store";
import { makeItemGroupService } from "Sharing/2/Services/ItemGroupService";
import { makeItemService } from "Sharing/2/Services/ItemService";
import { makeItemGroupWS } from "Libs/WS/Sharing/2/PerformItemGroupAction";
import { makeWSUserAlias } from "Libs/WS/UserAlias";
import { generateItemUuid } from "Utils/generateItemUuid";
import { makeCryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import { makeSymmetricEncryption as makeSharingSymmetricEncryption } from "Libs/CryptoCenter/SharingCryptoService";
import { WSService } from "Libs/WS/index";
import { getItemGroupKey } from "Sharing/2/Services/SharingHelpers";
import {
  createAuditLogDetails,
  validateItemGroupResponse,
} from "Sharing/2/Services/utils";
import { ukiSelector } from "Authentication/selectors";
import { personalDataSelector } from "DataManagement/PersonalData/selectors";
import { RevokeActionOrigin } from "Libs/WS/Sharing/2/types";
import { CollectionDownload } from "./collection-helpers";
const invalidEmailChars = /[<>]/g;
const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase().replace(invalidEmailChars, "");
};
export async function shareAlreadySharedItem(
  applicationModulesAccess: ApplicationModulesAccess,
  storeService: StoreService,
  wsService: WSService,
  itemGroup: ItemGroupDownload,
  permission: MemberPermission,
  recipients: Recipient[]
): Promise<void> {
  try {
    const login = storeService.getUserLogin();
    const state = storeService.getState();
    const uki = ukiSelector(state);
    const { privateKey } = storeService.getUserSession().keyPair;
    const { collections, userGroups: sharingUserGroupsUnsafe } =
      storeService.getSharingData();
    const sharingUserGroups = sharingUserGroupsUnsafe.filter(Boolean);
    const { groupId: itemGroupId, revision } = itemGroup;
    const { credentials, notes, secrets } = storeService.getPersonalData();
    const personalDataItems = [...credentials, ...notes, ...secrets];
    const crypto = await makeCryptoService();
    const { makeInviteItemGroupMembers, makeUserGroupInvite, makeUserUpload } =
      makeItemGroupService(wsService, crypto);
    const { findUsersByAliases } = makeWSUserAlias();
    const { makeItemForEmailing } = makeItemService();
    const { inviteItemGroupMembers } = makeItemGroupWS();
    const itemGroupKey = await getItemGroupKey(
      itemGroup,
      sharingUserGroups,
      privateKey,
      login,
      collections
    );
    if (!itemGroupKey) {
      const message = `Couldn't get itemGroupKey, aborting.`;
      throw new Error(message);
    }
    const rawUsers = recipients.filter(isUserRecipient);
    const aliases = rawUsers.map(({ alias }) => sanitizeEmail(alias));
    const jsonAliases = JSON.stringify(aliases);
    const foundUsers = await findUsersByAliases({
      login,
      uki,
      aliases: jsonAliases,
    });
    const userInvitePromises = aliases.map((alias) =>
      makeUserUpload(
        alias,
        foundUsers[alias],
        itemGroupId,
        permission,
        itemGroupKey
      )
    );
    const users = await Promise.all(userInvitePromises);
    const itemGroupItemIds = (itemGroup.items || []).map(
      ({ itemId }) => itemId
    );
    const items = personalDataItems.filter((i) =>
      itemGroupItemIds.includes(i.Id)
    );
    const itemsForEmailing = items.map(makeItemForEmailing);
    const rawUserGroups = recipients.filter(isGroupRecipient);
    const userGroupIds = rawUserGroups.map((u) => u.groupId);
    const userGroups = sharingUserGroups.filter(({ groupId }) =>
      userGroupIds.includes(groupId)
    );
    const groupPromises = userGroups.map((userGroup) =>
      makeUserGroupInvite(
        userGroup,
        permission,
        itemGroupKey,
        privateKey,
        login,
        itemGroupId
      )
    );
    const groups = await Promise.all(groupPromises);
    const auditLogDetails = await createAuditLogDetails(
      applicationModulesAccess,
      state,
      items[0]
    );
    const inviteItemGroupMembersEvent = makeInviteItemGroupMembers(
      itemGroupId,
      revision,
      users,
      groups,
      itemsForEmailing,
      auditLogDetails
    );
    const res = await inviteItemGroupMembers(
      login,
      uki,
      inviteItemGroupMembersEvent,
      auditLogDetails
    );
    if (res && res.itemGroups && res.itemGroups.length === 1) {
      const { publicKey } = storeService.getUserSession().keyPair;
      await validateItemGroupResponse(
        "[SharingUserActionsService] - shareAlreadySharedItem",
        crypto,
        res,
        publicKey,
        privateKey,
        itemGroupKey,
        login,
        users,
        sharingUserGroups
      );
    }
  } catch (error) {
    error.message = `[SharingUserActionsService] - shareAlreadySharedItem: ${error.message}`;
    throw error;
  }
}
export async function shareUnsharedItem(
  applicationModulesAccess: ApplicationModulesAccess,
  storeService: StoreService,
  wsService: WSService,
  item: Credential | Note | Secret,
  permission: MemberPermission,
  recipients: Recipient[]
): Promise<void> {
  try {
    const login = storeService.getUserLogin();
    const state = storeService.getState();
    const uki = ukiSelector(state);
    const { privateKey, publicKey } = storeService.getUserSession().keyPair;
    const { userGroups: sharingUserGroups } = storeService.getSharingData();
    const crypto = await makeCryptoService();
    const { makeCreateItemGroupEvent, makeUserGroupInvite, makeUserUpload } =
      makeItemGroupService(wsService, crypto);
    const { makeItemUpload, makeItemForEmailing } = makeItemService();
    const { createItemGroup } = makeItemGroupWS();
    const { findUsersByAliases } = makeWSUserAlias();
    const itemGroupId = generateItemUuid();
    const itemGroupKey = await crypto.symmetricEncryption.generateNewAESKey();
    const rawUsers = recipients.filter(isUserRecipient);
    const aliases = rawUsers.map(({ alias }) => sanitizeEmail(alias));
    const jsonAliases = JSON.stringify(aliases);
    const foundUsers = await findUsersByAliases({
      login,
      uki,
      aliases: jsonAliases,
    });
    const myUserUploadUser = { login, publicKey, privateKey };
    const myUserUploadPromise = makeUserUpload(
      login,
      myUserUploadUser,
      itemGroupId,
      "admin",
      itemGroupKey
    );
    const userUploadPromises = aliases
      .map((alias) =>
        makeUserUpload(
          alias,
          foundUsers[alias],
          itemGroupId,
          permission,
          itemGroupKey
        )
      )
      .concat(myUserUploadPromise);
    const userUploads = await Promise.all(userUploadPromises);
    const rawUserGroups = recipients.filter(isGroupRecipient);
    const userGroupIds = rawUserGroups.map((u) => u.groupId);
    const userGroups = sharingUserGroups.filter(({ groupId }) =>
      userGroupIds.includes(groupId)
    );
    const groupPromises = userGroups.map((userGroup) =>
      makeUserGroupInvite(
        userGroup,
        permission,
        itemGroupKey,
        privateKey,
        login,
        itemGroupId
      )
    );
    const groups = await Promise.all(groupPromises);
    const { Id } = item;
    const sharingCrypto = makeSharingSymmetricEncryption();
    const rawItemKey = await crypto.symmetricEncryption.generateNewAESKey();
    const itemKey = await crypto.symmetricEncryption.encryptAES256(
      itemGroupKey,
      rawItemKey
    );
    const itemContent = await sharingCrypto.encryptSharingItem(
      rawItemKey,
      item
    );
    const itemUpload = await makeItemUpload(Id, itemKey, itemContent);
    const itemForEmailing = makeItemForEmailing(item);
    const auditLogDetails = await createAuditLogDetails(
      applicationModulesAccess,
      state,
      item
    );
    const createItemGroupEvent = makeCreateItemGroupEvent(
      itemGroupId,
      userUploads,
      groups,
      [itemUpload],
      [itemForEmailing],
      auditLogDetails
    );
    const res = await createItemGroup(login, uki, createItemGroupEvent);
    if (res && res.itemGroups && res.itemGroups.length === 1) {
      await validateItemGroupResponse(
        "[SharingUserActionsService] - shareUnsharedItem",
        crypto,
        res,
        publicKey,
        privateKey,
        itemGroupKey,
        login,
        userUploads,
        sharingUserGroups
      );
    }
  } catch (error) {
    error.message = `[SharingUserActionsService] - shareUnsharedItem: ${error.message}`;
    throw error;
  }
}
export function isUserItemGroupAdmin(
  itemGroup: ItemGroupDownload,
  userGroups: UserGroupDownload[],
  userId: string,
  collections?: CollectionDownload[]
): boolean {
  const adminAsUser = (itemGroup.users || []).some(
    ({ userId: igUserId, permission }) =>
      igUserId === userId && permission === "admin"
  );
  const adminFromCollection = (collections || []).some((collection) =>
    collection.users.some(
      ({ login, permission }) => login === userId && permission === "admin"
    )
  );
  const amIPartOfUserGroup = (userGroup: UserGroupDownload): boolean =>
    (userGroup.users || []).map(({ userId }) => userId).includes(userId);
  const userGroupsImPartOf = (userGroups || []).filter(amIPartOfUserGroup);
  const userGroupIdsImPartOf = userGroupsImPartOf.map(({ groupId }) => groupId);
  const adminAsUserGroup = (itemGroup.groups || [])
    .filter(({ groupId }) => userGroupIdsImPartOf.includes(groupId))
    .some(({ permission }) => permission === "admin");
  return adminAsUser || adminAsUserGroup || adminFromCollection;
}
export async function revokeItemGroupMember(
  applicationModulesAccess: ApplicationModulesAccess,
  storeService: StoreService,
  wsService: WSService,
  itemGroup: ItemGroupDownload,
  recipient: Recipient,
  origin: RevokeActionOrigin = "manual"
): Promise<void> {
  const crypto = await makeCryptoService();
  const { groupId, revision } = itemGroup;
  const state = storeService.getState();
  const uki = ukiSelector(state);
  const login = storeService.getUserLogin();
  const { makeRevokeItemGroupMembers } = makeItemGroupService(
    wsService,
    crypto
  );
  const users = recipient.type === "user" ? [recipient.alias] : [];
  const groups = recipient.type === "userGroup" ? [recipient.groupId] : [];
  const { credentials, notes, secrets } = personalDataSelector(state);
  const personalDataItems = [...credentials, ...notes, ...secrets];
  const itemGroupItemIds = (itemGroup.items || []).map(({ itemId }) => itemId);
  const items = personalDataItems.filter((i) =>
    itemGroupItemIds.includes(i.Id)
  );
  const auditLogDetails = await createAuditLogDetails(
    applicationModulesAccess,
    state,
    items[0]
  );
  const revokeEvent = makeRevokeItemGroupMembers(
    groupId,
    revision,
    users,
    groups,
    auditLogDetails,
    origin
  );
  await wsService.itemGroup.revokeItemGroupMembers(login, uki, revokeEvent);
}
