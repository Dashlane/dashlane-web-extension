import {
  ItemGroupDownload,
  ItemKey,
  UserDownload,
  UserGroupDownload,
  UserGroupMemberDownload,
} from "@dashlane/sharing/types/serverResponse";
import {
  Credential,
  MemberPermission,
  Note,
  Secret,
  SharingData,
} from "@dashlane/communication";
import { isAcceptSignatureValid, TypeOfArray } from "Sharing/2/Services/utils";
import { makeCryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import { State, StoreService } from "Store";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { credentialSelector } from "DataManagement/Credentials/selectors/credential.selector";
import { noteSelector } from "DataManagement/SecureNotes/selectors";
import { SharingUser } from "Sharing/2/SharingUser/types";
import { findItemItemGroup, getItemGroupActiveUsers } from "./itemGroupHelpers";
import { sendExceptionLog } from "Logs/Exception";
import { activeSpacesSelector } from "Session/selectors";
import { isPremiumStatusSpaceQuarantined } from "DataManagement/Spaces/is-quarantined";
import {
  CollectionDownload,
  ItemGroupDownload as NewItemGroupDownload,
  UserCollectionDownload,
  UserGroupCollectionDownload,
} from "@dashlane/server-sdk/v1";
import { secretSelector } from "DataManagement/Secrets/selectors";
const base64 = require("base-64");
const memberIsActive = (
  member: UserGroupMemberDownload | UserDownload
): boolean => ["accepted", "pending"].includes(member.status);
export interface UserGroupCollectionMember {
  userGroup?: UserGroupDownload;
  member: TypeOfArray<NewItemGroupDownload["collections"]>;
}
export const userMemberIsAdmin = (user: UserDownload): boolean =>
  user.status === "accepted" && user.permission === "admin";
export function isLastActiveUserInItemGroupAndAdmin(
  itemGroup: ItemGroupDownload,
  userId: string
): boolean {
  const collections = (itemGroup as NewItemGroupDownload).collections;
  if (collections && collections.length > 0) {
    return false;
  }
  const { users, groups } = itemGroup;
  const noGroups = !groups || groups.filter(memberIsActive).length === 0;
  const onlyUserAndAdmin =
    users &&
    users.filter(memberIsActive).length === 1 &&
    users[0].userId === userId &&
    userMemberIsAdmin(users[0]);
  return noGroups && onlyUserAndAdmin;
}
export function getItemGroupActiveUserGroupMembers(
  itemGroup: ItemGroupDownload
): UserGroupMemberDownload[] {
  return (itemGroup.groups || []).filter(memberIsActive);
}
export function findMyItemGroupUser(
  itemGroup: ItemGroupDownload,
  userId: string
): UserDownload | undefined {
  const { users } = itemGroup;
  return (users || []).find((u) => u.userId === userId);
}
export function findMyItemGroupUserGroupMember(
  itemGroup: ItemGroupDownload | NewItemGroupDownload,
  userGroups: UserGroupDownload[],
  userId: string
): UserGroupMemberDownload | null {
  const amIPartOfUserGroup = (userGroup: UserGroupDownload): boolean =>
    (userGroup.users || []).map((u: UserDownload) => u.userId).includes(userId);
  const userGroupsImPartOf = (userGroups || []).filter(amIPartOfUserGroup);
  const userGroupIdsImPartOf = userGroupsImPartOf.map(
    (g: UserGroupDownload) => g.groupId
  );
  const userStatusAccepted = (userGroup: UserGroupMemberDownload): boolean =>
    userGroup.status === "accepted";
  return (itemGroup.groups || [])
    .filter(userStatusAccepted)
    .find((g) => userGroupIdsImPartOf.includes(g.groupId));
}
export function findMyItemGroupCollectionMemberViaUserGroup(
  itemGroup: NewItemGroupDownload,
  userGroups: UserGroupDownload[],
  userId: string,
  collections?: CollectionDownload[]
): UserGroupCollectionMember | null {
  if (!collections) {
    return null;
  }
  try {
    const areMyGroupsPartOfCollection = (collection: CollectionDownload) =>
      (collection.userGroups || [])
        .flatMap(
          (userGroup) =>
            userGroups.find((ug) => ug.groupId === userGroup.uuid)?.users
        )
        .filter((x) => x !== undefined)
        .find((user) => user.status === "accepted" && user.userId === userId);
    const collectionsMyGroupIsPartOf = collections.filter(
      areMyGroupsPartOfCollection
    );
    if (collectionsMyGroupIsPartOf.length === 0) {
      return null;
    }
    const collectionIdsMyGroupIsPartOf = collectionsMyGroupIsPartOf.map(
      (c) => c.uuid
    );
    const myItemGroupCollectionMember = (itemGroup.collections || [])
      .filter((collection) => collection.status === "accepted")
      .find((collection) =>
        collectionIdsMyGroupIsPartOf.includes(collection.uuid)
      );
    if (!myItemGroupCollectionMember) {
      return null;
    }
    const myCollection = collections.find(
      (c) => c.uuid === myItemGroupCollectionMember.uuid
    );
    if (!myCollection) {
      return null;
    }
    const theUserGroupIds = myCollection.userGroups.map((g) => g.uuid);
    const userGroup = userGroups.find((group) =>
      theUserGroupIds.includes(group.groupId)
    );
    if (!userGroup) {
      return null;
    }
    return {
      userGroup,
      member: myItemGroupCollectionMember,
    };
  } catch (error) {
    const message = `[SharingSync] - find collection member failed: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    return null;
  }
}
export function findMyItemGroupCollectionMemberAsUser(
  itemGroup: NewItemGroupDownload,
  userId: string,
  collections?: CollectionDownload[]
): TypeOfArray<NewItemGroupDownload["collections"]> | null {
  if (!collections) {
    return null;
  }
  try {
    const amIPartOfCollection = (collection: CollectionDownload): boolean =>
      (collection.users || [])
        .map((user: UserCollectionDownload) => user.login)
        .includes(userId);
    const collectionImPartOf = collections.filter(amIPartOfCollection);
    const collectionIdsImPartOf = collectionImPartOf.map(
      (collection) => collection.uuid
    );
    const myItemGroupCollectionMember = (itemGroup.collections || [])
      .filter((collection) => collection.status === "accepted")
      .find((collection) => collectionIdsImPartOf.includes(collection.uuid));
    return myItemGroupCollectionMember;
  } catch (error) {
    const message = `[SharingSync] - find collection member failed: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    return null;
  }
}
export async function getItemGroupKey(
  itemGroup: ItemGroupDownload,
  userGroups: UserGroupDownload[],
  privateKey: string,
  userId: string,
  collections?: CollectionDownload[]
): Promise<string | null> {
  const itemGroupUser = findMyItemGroupUser(itemGroup, userId);
  const itemGroupUserGroupMember = findMyItemGroupUserGroupMember(
    itemGroup,
    userGroups,
    userId
  );
  const itemGroupCollectionMemberAsUser = findMyItemGroupCollectionMemberAsUser(
    itemGroup as NewItemGroupDownload,
    userId,
    collections
  );
  const itemGroupCollectionMemberViaUserGroup =
    findMyItemGroupCollectionMemberViaUserGroup(
      itemGroup as NewItemGroupDownload,
      userGroups,
      userId,
      collections
    );
  if (
    !itemGroupUser &&
    !itemGroupUserGroupMember &&
    !itemGroupCollectionMemberAsUser &&
    !itemGroupCollectionMemberViaUserGroup
  ) {
    return null;
  }
  if (itemGroupUser) {
    return await getDecryptedItemGroupKeyFromUser(itemGroupUser, privateKey);
  } else if (itemGroupUserGroupMember) {
    return await getDecryptedItemGroupKeyFromUserGroupMember(
      itemGroupUserGroupMember,
      userGroups,
      privateKey,
      userId
    );
  } else if (itemGroupCollectionMemberAsUser) {
    const key = await getDecryptedItemGroupKeyFromCollectionMemberAsUser(
      itemGroupCollectionMemberAsUser,
      privateKey,
      userId,
      collections
    );
    return key;
  } else if (itemGroupCollectionMemberViaUserGroup) {
    const key = await getDecryptedItemGroupKeyFromCollectionMemberViaUserGroup(
      itemGroupCollectionMemberViaUserGroup.member,
      itemGroupCollectionMemberViaUserGroup.userGroup,
      privateKey,
      userId,
      collections
    );
    return key;
  }
  return null;
}
export async function getDecryptedItemGroupKeyFromUser(
  itemGroupUser: UserDownload,
  privateKey: string
): Promise<string | null> {
  try {
    return await decryptGroupKey(itemGroupUser.groupKey, privateKey);
  } catch {
    return null;
  }
}
export async function getDecryptedItemGroupKeyFromUserGroupMember(
  groupMember: UserGroupMemberDownload,
  userGroups: UserGroupDownload[],
  privateKey: string,
  userId: string
): Promise<string | null> {
  const userGroup = (userGroups || []).find(
    (u: UserGroupDownload) => u.groupId === groupMember.groupId
  );
  if (!userGroup) {
    return null;
  }
  try {
    const userGroupPrivateKey = await getUserGroupPrivateKey(
      userGroup,
      privateKey,
      userId
    );
    return await decryptGroupKey(groupMember.groupKey, userGroupPrivateKey);
  } catch {
    return null;
  }
}
export async function getDecryptedItemGroupKeyFromCollectionMemberAsUser(
  member: TypeOfArray<NewItemGroupDownload["collections"]>,
  privateKey: string,
  userId: string,
  collections?: CollectionDownload[]
): Promise<string | null> {
  if (!collections) {
    return null;
  }
  try {
    const collection = collections.find((c) => c.uuid === member.uuid);
    if (!collection) {
      return null;
    }
    const collectionPrivateKey = await getCollectionPrivateKeyForUser(
      collection,
      privateKey,
      userId
    );
    return await decryptGroupKey(member.itemGroupKey, collectionPrivateKey);
  } catch (error) {
    const message = `[SharingSync] - decrypt collection member item group key failed: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    return null;
  }
}
export async function getDecryptedPrivateCollectionKeyFromUserGroup(
  collection: CollectionDownload,
  userGroup: UserGroupDownload,
  privateKey: string,
  userId: string
) {
  const userGroupPrivateKey = await getUserGroupPrivateKey(
    userGroup,
    privateKey,
    userId
  );
  return await getCollectionPrivateKeyForUserGroup(
    collection,
    userGroupPrivateKey,
    userGroup.groupId
  );
}
export async function getDecryptedItemGroupKeyFromCollectionMemberViaUserGroup(
  member: TypeOfArray<NewItemGroupDownload["collections"]>,
  userGroup: UserGroupDownload,
  privateKey: string,
  userId: string,
  collections?: CollectionDownload[]
): Promise<string | null> {
  if (!collections) {
    return null;
  }
  try {
    const collection = collections.find((c) => c.uuid === member.uuid);
    if (!collection) {
      return null;
    }
    const collectionPrivateKey =
      await getDecryptedPrivateCollectionKeyFromUserGroup(
        collection,
        userGroup,
        privateKey,
        userId
      );
    const result = await decryptGroupKey(
      member.itemGroupKey,
      collectionPrivateKey
    );
    return result;
  } catch (error) {
    const message = `[SharingSync] - decrypt collection member item group key failed: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    return null;
  }
}
export async function decryptGroupKey(
  encryptedResourceKey: string,
  userPrivateKey: string
): Promise<string> {
  return makeCryptoService().asymmetricEncryption.decrypt(
    userPrivateKey,
    encryptedResourceKey
  );
}
export async function getUserGroupPrivateKey(
  userGroup: UserGroupDownload,
  privateKey: string,
  userId: string
): Promise<string> {
  const me = userGroup.users.find((u: UserDownload) => u.userId === userId);
  const encryptedUserGroupKey = me.groupKey;
  const decryptedUserKey = await decryptGroupKey(
    encryptedUserGroupKey,
    privateKey
  );
  return decryptUserGroupPrivateKey(userGroup.privateKey, decryptedUserKey);
}
export async function getCollectionPrivateKeyForUserGroup(
  collection: CollectionDownload,
  privateKey: string,
  userGroupId: string
): Promise<string> {
  const me = collection.userGroups.find((ug) => ug.uuid === userGroupId);
  const encryptedCollectionKey = me.collectionKey;
  const decryptedCollectionKey = await decryptGroupKey(
    encryptedCollectionKey,
    privateKey
  );
  return decryptUserGroupPrivateKey(
    collection.privateKey,
    decryptedCollectionKey
  );
}
export async function getCollectionPrivateKeyForUser(
  collection: CollectionDownload,
  privateKey: string,
  userId: string
): Promise<string> {
  const me = collection.users.find((u) => u.login === userId);
  const encryptedCollectionKey = me.collectionKey;
  const decryptedUserGroupKey = await decryptGroupKey(
    encryptedCollectionKey,
    privateKey
  );
  return decryptUserGroupPrivateKey(
    collection.privateKey,
    decryptedUserGroupKey
  );
}
export async function decryptUserGroupPrivateKey(
  encryptedUserGroupPrivateKey: string,
  userGroupKey: string
): Promise<string> {
  return makeCryptoService().symmetricEncryption.decryptAES256(
    userGroupKey,
    encryptedUserGroupPrivateKey
  );
}
export async function isGroupSignatureValid(
  groupId: string,
  acceptSignature: string,
  decryptedGroupKey: string,
  publicKey: string
): Promise<boolean> {
  const data = base64.encode(`${groupId}-accepted-${decryptedGroupKey}`);
  return isAcceptSignatureValid(
    makeCryptoService(),
    acceptSignature,
    publicKey,
    data
  );
}
export async function isUserGroupPersonalSignatureValid(
  groupId: string,
  acceptSignature: string,
  decryptedGroupKey: string,
  publicKey: string
): Promise<boolean> {
  try {
    return await isGroupSignatureValid(
      groupId,
      acceptSignature,
      decryptedGroupKey,
      publicKey
    );
  } catch {
    return false;
  }
}
export async function getDecryptedUserGroupKey(
  encryptedGroupKey: string,
  privateKey: string
): Promise<string | null> {
  try {
    return await decryptGroupKey(encryptedGroupKey, privateKey);
  } catch {
    return null;
  }
}
export async function areUserGroupUsersProposeSignaturesValid(
  users: UserDownload[],
  userGroupKey: string
): Promise<boolean> {
  const validityPromises = (users || [])
    .filter(({ status }) => ["pending", "accepted"].includes(status))
    .map((user: UserDownload | UserCollectionDownload) =>
      isUserGroupUserProposeSignatureValid(user, userGroupKey)
    );
  const validities = await Promise.all(validityPromises);
  return validities.every(Boolean);
}
export async function areCollectionUsersProposeSignaturesValid(
  collection: CollectionDownload,
  collectionKey: string
): Promise<boolean> {
  const { userGroups, users } = collection;
  const userValidityPromises = (users || [])
    .filter(({ status }) => ["pending", "accepted"].includes(status))
    .map((user) => isUserGroupUserProposeSignatureValid(user, collectionKey));
  const groupValidityPromises = (userGroups || [])
    .filter(({ status }) => ["pending", "accepted"].includes(status))
    .map((group) =>
      isCollectionUserGroupProposeSignatureValid(group, collectionKey)
    );
  const userValidities = await Promise.all(userValidityPromises);
  const groupValidities = await Promise.all(groupValidityPromises);
  return userValidities.every(Boolean) && groupValidities.every(Boolean);
}
export async function isUserGroupUserProposeSignatureValid(
  user: UserDownload | UserCollectionDownload,
  userGroupKey: string
): Promise<boolean> {
  let id = "";
  if ("userId" in user) {
    id = user.userId;
  } else if ("login" in user) {
    id = user.login;
  }
  try {
    return await makeCryptoService().symmetricEncryption.verifyHmacSHA256(
      userGroupKey,
      user.proposeSignature,
      base64.encode(id)
    );
  } catch {
    return false;
  }
}
export async function isCollectionUserGroupProposeSignatureValid(
  group: UserGroupCollectionDownload,
  collectionKey: string
): Promise<boolean> {
  try {
    return await makeCryptoService().symmetricEncryption.verifyHmacSHA256(
      collectionKey,
      group.proposeSignature,
      base64.encode(group.uuid)
    );
  } catch {
    return false;
  }
}
export function findItem(
  storeService: StoreService,
  itemId: string
): Credential | Note | Secret | null {
  const { credentials, notes, secrets } = storeService.getPersonalData();
  const objects = [...credentials, ...notes, ...secrets];
  return findDataModelObject(itemId, objects);
}
export function getMyItemGroups(
  sharingData: SharingData,
  userId: string
): ItemGroupDownload[] {
  const myGroups = sharingData.userGroups.filter((group) =>
    group.users.some(
      (userMember) =>
        userMember.userId === userId && userMember.status === "accepted"
    )
  );
  const myGroupIds = new Set(myGroups.map((group) => group.groupId));
  return sharingData.itemGroups.filter((itemGroup) => {
    const sharedToMe =
      itemGroup.users && itemGroup.users.some((user) => user.userId === userId);
    const sharedToMyGroup =
      itemGroup.groups &&
      itemGroup.groups.some((userGroupMember) =>
        myGroupIds.has(userGroupMember.groupId)
      );
    return sharedToMe || sharedToMyGroup;
  });
}
export function getUserGroupPermission(
  itemGroup: ItemGroupDownload,
  groupId: string
): MemberPermission | undefined {
  return (itemGroup?.groups || []).find((group) => group?.groupId === groupId)
    ?.permission;
}
export function getSharingUserPermission(
  itemGroup: ItemGroupDownload,
  userId: string
): MemberPermission | undefined {
  return (itemGroup.users || []).find((user) => user.userId === userId)
    ?.permission;
}
export async function decryptItemKey(
  itemKey: string,
  itemGroupKey: string
): Promise<string> {
  return makeCryptoService().symmetricEncryption.decryptAES256(
    itemGroupKey,
    itemKey
  );
}
export function getItemGroupPendingUserMember(
  itemGroup: ItemGroupDownload,
  userId: string
): UserDownload | undefined {
  return (itemGroup.users || []).find(
    (user) => user.userId === userId && user.status === "pending"
  );
}
export function isItemGroupAccepted(
  itemGroup: ItemGroupDownload,
  userGroups: UserGroupDownload[],
  userId: string,
  collections?: CollectionDownload[]
): boolean {
  const acceptedByMyAcceptedCollection =
    isItemGroupAcceptedByMyAcceptedCollection(
      itemGroup as NewItemGroupDownload,
      userGroups,
      userId,
      collections
    );
  if (acceptedByMyAcceptedCollection) {
    return true;
  }
  const acceptedByMe = isItemGroupAcceptedByMe(itemGroup, userId);
  if (acceptedByMe) {
    return true;
  }
  const acceptedByMyAcceptedGroup = isItemGroupAcceptedByMyAcceptedGroup(
    itemGroup,
    userGroups,
    userId
  );
  return acceptedByMyAcceptedGroup;
}
function isItemGroupAcceptedByMe(
  itemGroup: ItemGroupDownload,
  userId: string
): boolean {
  return (itemGroup.users || []).some(
    (user) =>
      user.userId === userId &&
      user.status === "accepted" &&
      Boolean(user.acceptSignature)
  );
}
function isItemGroupAcceptedByMyAcceptedGroup(
  itemGroup: ItemGroupDownload,
  userGroups: UserGroupDownload[],
  userId: string
): boolean {
  const userGroupMembersThatAccepted = (itemGroup.groups || []).filter(
    (groupMember) =>
      groupMember.status === "accepted" && groupMember.acceptSignature
  );
  const userGroupMembersThatAcceptedIds = userGroupMembersThatAccepted.map(
    (g) => g.groupId
  );
  const relativeUserGroups = userGroups.filter((userGroup) =>
    userGroupMembersThatAcceptedIds.includes(userGroup.groupId)
  );
  return relativeUserGroups.some((userGroup) =>
    (userGroup.users || []).some(
      (user) =>
        user.userId === userId &&
        user.status === "accepted" &&
        Boolean(user.acceptSignature)
    )
  );
}
function isItemGroupAcceptedByMyAcceptedCollection(
  itemGroup: NewItemGroupDownload,
  userGroups: UserGroupDownload[],
  userId: string,
  collections?: CollectionDownload[]
): boolean {
  if (!collections) {
    return false;
  }
  try {
    const collectionMembersThatAccepted = (itemGroup.collections || []).filter(
      (member) => member.status === "accepted" && member.acceptSignature
    );
    const collectionMembersThatAcceptedIds = collectionMembersThatAccepted.map(
      (c) => c.uuid
    );
    const relativeCollections = collections.filter((collection) =>
      collectionMembersThatAcceptedIds.includes(collection.uuid)
    );
    const acceptedByUser = relativeCollections
      .flatMap((collection) => collection.users)
      .some((user) => user.acceptSignature && user.login === userId);
    if (acceptedByUser) {
      return true;
    }
    const acceptedByGroup = relativeCollections
      .flatMap((collection) => collection.userGroups)
      .map((group) =>
        userGroups.find((userGroup) => userGroup.groupId === group.uuid)
      )
      .filter((x) => x !== undefined)
      .some((userGroup) =>
        (userGroup.users || []).some(
          (user) =>
            user.userId === userId &&
            user.status === "accepted" &&
            Boolean(user.acceptSignature)
        )
      );
    return acceptedByGroup;
  } catch (error) {
    const message = `[SharingSync] - item group accepted check failed: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    return false;
  }
}
export function isItemWithoutItemGroup(
  itemId: string,
  itemGroups: ItemGroupDownload[]
) {
  const matchingItemGroups = findItemItemGroup(itemId, itemGroups);
  return !matchingItemGroups;
}
export async function getDecipheredItemKey(
  encryptedGroupKey: string,
  encryptedItemKey: string,
  privateKey: string
): Promise<string | undefined> {
  const groupKey = await decryptGroupKey(encryptedGroupKey, privateKey);
  try {
    return await decryptItemKey(encryptedItemKey, groupKey);
  } catch (_e) {
    return undefined;
  }
}
function getItemGroupUserAdmins(itemGroup: ItemGroupDownload): UserDownload[] {
  return (itemGroup.users || []).filter(
    ({ permission, rsaStatus, status }) =>
      permission === "admin" &&
      rsaStatus === "sharingKeys" &&
      status === "accepted"
  );
}
function getItemGroupGroupAdmins(
  itemGroup: ItemGroupDownload
): UserGroupMemberDownload[] {
  return (itemGroup.groups || []).filter(
    ({ permission, status }) => permission === "admin" && status === "accepted"
  );
}
export function isUserLastAdmin(
  itemGroup: ItemGroupDownload,
  userId: string
): boolean {
  const userAdmins = getItemGroupUserAdmins(itemGroup);
  const groupAdmins = getItemGroupGroupAdmins(itemGroup);
  const isUserDirectAdmin = userAdmins.some((u) => u.userId === userId);
  const otherDirectUsersAdmins = userAdmins.filter(
    ({ userId: adminUserId }) => userId !== adminUserId
  );
  const hasOtherAdmins = groupAdmins.length + otherDirectUsersAdmins.length > 0;
  return isUserDirectAdmin && !hasOtherAdmins;
}
export function doesUserReceiveItemGroupViaGroup(
  itemGroup: ItemGroupDownload,
  userGroups: UserGroupDownload[],
  userId: string
): boolean {
  const myGroupIds = userGroups
    .filter(({ users }) =>
      (users || []).some((u) => u.userId === userId && u.status === "accepted")
    )
    .map(({ groupId }) => groupId);
  return (itemGroup.groups || []).some(
    ({ groupId, status }) =>
      myGroupIds.includes(groupId) && status === "accepted"
  );
}
export function getGroupRecipients(
  sharingData: SharingData,
  id: string
): UserGroupMemberDownload[] {
  const { itemGroups } = sharingData;
  const itemGroup = itemGroups.find((iG) =>
    (iG.items || []).some((item) => item.itemId === id)
  );
  if (!itemGroup) {
    return [];
  }
  return (itemGroup.groups || []).filter(
    (groupMember) => !["revoked", "refused"].includes(groupMember.status)
  );
}
export function getUserRecipients(
  sharingData: SharingData,
  id: string
): UserDownload[] {
  const { itemGroups } = sharingData;
  const itemGroup = itemGroups.find((iG) =>
    (iG.items || []).some((item) => item.itemId === id)
  );
  if (!itemGroup) {
    return [];
  }
  return (itemGroup.users || []).filter(
    (user) => !["revoked", "refused"].includes(user.status)
  );
}
export function getRecipientsCount(
  sharingData: SharingData,
  id: string
): number {
  const userRecipientsCount = getUserRecipients(sharingData, id).length;
  const groupsRecipientsCount = getGroupRecipients(sharingData, id).length;
  return userRecipientsCount + groupsRecipientsCount;
}
export function findMyAcceptedUserGroups(
  userGroups: UserGroupDownload[],
  login: string
): UserGroupDownload[] {
  return userGroups.filter(
    (userGroup) =>
      userGroup.type === "users" &&
      (userGroup.users || []).some(
        (user) => user.userId === login && user.status === "accepted"
      )
  );
}
export function findUserGroup(
  userGroups: UserGroupDownload[],
  groupId: string
): UserGroupDownload | undefined {
  return userGroups.find((userGroup) => userGroup.groupId === groupId);
}
export function findUserGroupItemGroups(
  userGroupId: string,
  itemGroups: ItemGroupDownload[]
): ItemGroupDownload[] {
  return itemGroups.filter((itemGroup: ItemGroupDownload) => {
    return (itemGroup.groups || []).some(
      (groupMember: UserGroupMemberDownload) => {
        return (
          groupMember.groupId === userGroupId &&
          groupMember.status === "accepted"
        );
      }
    );
  });
}
function sendSharing361DebuggingLogs(
  itemGroup: ItemGroupDownload,
  item: ItemKey,
  state: State,
  spaceId: string
) {
  try {
    const errorMessage = [
      "[doesItemGroupExistInSpace] Undefined item found",
      `ItemGroup has ${itemGroup.items.length} items`,
    ];
    if (itemGroup.items.length > 1) {
      const otherItemsInSpace = itemGroup.items.filter(
        (itemKey) => itemKey.itemId !== item.itemId
      );
      const areInSpaceCount = otherItemsInSpace.reduce((count, itemKey) => {
        const itemInfo =
          credentialSelector(state, itemKey.itemId) ??
          noteSelector(state, itemKey.itemId);
        return itemInfo && itemInfo.SpaceId === spaceId ? count + 1 : count;
      }, 0);
      const notInSpaceCount = otherItemsInSpace.length - areInSpaceCount;
      errorMessage.push(
        `${areInSpaceCount} other items in itemGroup are in the active space`
      );
      errorMessage.push(
        `${notInSpaceCount} other items in itemGroup are not in the active space`
      );
    }
    const activeSpaces = activeSpacesSelector(state);
    const isQuarantinedSpace = activeSpaces.some(
      (space) =>
        space &&
        space.teamId === spaceId &&
        isPremiumStatusSpaceQuarantined(space)
    );
    if (isQuarantinedSpace) {
      errorMessage.push("Active space is quarantined");
    }
    if (item.itemKey === null) {
      errorMessage.push("Item Key is null");
    }
    if (item.itemKey === undefined) {
      errorMessage.push("Item Key is undefined");
    }
    if (item.itemKey === "") {
      errorMessage.push("Item Key is an empty string");
    }
    if (item.itemId === null) {
      errorMessage.push("Item ID is null");
    }
    if (item.itemId === undefined) {
      errorMessage.push("Item ID is undefined");
    }
    if (item.itemId === "") {
      errorMessage.push("Item ID is an empty string");
    }
    sendExceptionLog({
      error: new Error(errorMessage.join("\n")),
    });
  } catch (error) {
    sendExceptionLog({
      error,
    });
  }
}
export function doesItemGroupExistInSpace(
  state: State,
  itemGroup: ItemGroupDownload,
  spaceId: string
): boolean {
  const containsAnotherSpaceItem = itemGroup.items?.some((item: ItemKey) => {
    const itemInfo =
      credentialSelector(state, item.itemId) ??
      noteSelector(state, item.itemId) ??
      secretSelector(state, item.itemId);
    if (itemInfo === undefined) {
      sendSharing361DebuggingLogs(itemGroup, item, state, spaceId);
      return true;
    }
    if (itemInfo.SpaceId !== spaceId) {
      return true;
    }
    return false;
  });
  return !containsAnotherSpaceItem;
}
export const getSharingUsersFromItemGroups = (
  state: State,
  userId: string,
  itemGroups: ItemGroupDownload[],
  spaceId: string
): SharingUser[] => {
  const sharingUserMap = itemGroups.reduce(
    (sharingUsers: Map<string, SharingUser>, itemGroup) => {
      if (
        spaceId !== null &&
        !doesItemGroupExistInSpace(state, itemGroup, spaceId)
      ) {
        return sharingUsers;
      }
      const itemGroupActiveUsers = getItemGroupActiveUsers(itemGroup);
      itemGroupActiveUsers.forEach((user: UserDownload) => {
        if (user.userId === userId) {
          return;
        }
        if (sharingUsers.has(user.userId)) {
          const sharingUser = sharingUsers.get(user.userId);
          sharingUsers.set(user.userId, {
            ...user,
            itemCount: sharingUser.itemCount + itemGroup.items.length,
          });
        } else {
          sharingUsers.set(user.userId, {
            ...user,
            itemCount: itemGroup.items.length,
          });
        }
      });
      return sharingUsers;
    },
    new Map<string, SharingUser>()
  );
  return Array.from(sharingUserMap.values());
};
