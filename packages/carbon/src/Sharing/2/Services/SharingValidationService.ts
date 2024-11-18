import { ErrorName } from "@dashlane/hermes";
import {
  ItemGroupDownload,
  ItemKey,
  UserDownload,
  UserGroupDownload,
  UserGroupMemberDownload,
} from "@dashlane/sharing/types/serverResponse";
import {
  CollectionDownload,
  ItemGroupDownload as NewItemGroupDownload,
  UserGroupCollectionDownload,
} from "@dashlane/server-sdk/v1";
import { makeCryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import Debugger from "Logs/Debugger";
import {
  areCollectionUsersProposeSignaturesValid,
  areUserGroupUsersProposeSignaturesValid,
  decryptGroupKey,
  decryptItemKey,
  findMyItemGroupCollectionMemberAsUser,
  findMyItemGroupCollectionMemberViaUserGroup,
  findMyItemGroupUser,
  findMyItemGroupUserGroupMember,
  getCollectionPrivateKeyForUser,
  getDecryptedItemGroupKeyFromUser,
  getDecryptedItemGroupKeyFromUserGroupMember,
  getDecryptedPrivateCollectionKeyFromUserGroup,
  getDecryptedUserGroupKey,
  getItemGroupKey,
  getUserGroupPrivateKey,
  isGroupSignatureValid,
  UserGroupCollectionMember,
} from "Sharing/2/Services/SharingHelpers";
const base64 = require("base-64");
export interface ItemKeys {
  [itemId: string]: string;
}
const doDebug = false;
export type InvalidItemGroupError =
  | ErrorName.ItemGroupNoAccess
  | ErrorName.ItemGroupInvalidKey
  | ErrorName.ItemGroupInvalidGroupAcceptSignature
  | ErrorName.ItemGroupInvalidGroupProposeSignature
  | ErrorName.ItemGroupInvalidUserAcceptSignature
  | ErrorName.ItemGroupInvalidUserProposeSignature;
export type ValidItemGroupResult = {
  isValid: true;
  itemKeys: ItemKeys;
};
export type InvalidItemGroupResult = {
  isValid: false;
  error: InvalidItemGroupError;
};
export type IsItemGroupValidResult =
  | ValidItemGroupResult
  | InvalidItemGroupResult;
export async function validateItemGroup(
  itemGroup: ItemGroupDownload,
  userGroups: UserGroupDownload[],
  privateKey: string,
  publicKey: string,
  userId: string,
  collections?: CollectionDownload[]
): Promise<IsItemGroupValidResult> {
  const itemGroupId = itemGroup.groupId;
  const itemGroupWithCollections = itemGroup as NewItemGroupDownload;
  const itemGroupUser = findMyItemGroupUser(itemGroup, userId);
  const itemGroupUserGroupMember = findMyItemGroupUserGroupMember(
    itemGroup,
    userGroups,
    userId
  );
  const itemGroupCollectionMember = findMyItemGroupCollectionMemberViaUserGroup(
    itemGroupWithCollections,
    userGroups,
    userId,
    collections
  );
  const itemGroupCollectionMemberUser = findMyItemGroupCollectionMemberAsUser(
    itemGroupWithCollections,
    userId,
    collections
  );
  if (
    !itemGroupUser &&
    !itemGroupUserGroupMember &&
    !itemGroupCollectionMemberUser &&
    !itemGroupCollectionMember
  ) {
    return { isValid: false, error: ErrorName.ItemGroupNoAccess };
  }
  const itemGroupKey = await getItemGroupKey(
    itemGroup,
    userGroups,
    privateKey,
    userId,
    collections
  );
  if (doDebug) {
    Debugger.log("ITEM_GROUP_KEY", !!itemGroupKey);
  }
  if (!itemGroupKey) {
    return {
      isValid: false,
      error: ErrorName.ItemGroupInvalidKey,
    };
  }
  const itemGroupUserValid =
    !itemGroupUser ||
    (await isItemGroupUserValid(
      itemGroupId,
      itemGroupUser,
      privateKey,
      publicKey
    ));
  if (doDebug) {
    Debugger.log("ITEM_GROUP_USER_VALID", itemGroupUserValid);
  }
  if (!itemGroupUserValid) {
    return {
      isValid: false,
      error: ErrorName.ItemGroupInvalidUserAcceptSignature,
    };
  }
  const itemGroupUserGroupValid =
    !itemGroupUserGroupMember ||
    (await isItemGroupUserGroupMemberValid(
      itemGroupId,
      itemGroupUserGroupMember,
      userGroups,
      privateKey,
      userId
    ));
  const itemGroupCollectionValid =
    !itemGroupCollectionMember ||
    (await isItemGroupCollectionMemberValid(
      itemGroupId,
      itemGroupCollectionMember,
      collections,
      privateKey,
      userId
    ));
  const itemGroupCollectionUserValid =
    !itemGroupCollectionMemberUser ||
    (await isItemGroupCollectionMemberValid(
      itemGroupId,
      { member: itemGroupCollectionMemberUser },
      collections,
      privateKey,
      userId
    ));
  if (doDebug) {
    Debugger.log("ITEM_GROUP_USER_GROUP_VALID", itemGroupUserGroupValid);
    Debugger.log("ITEM_GROUP_COLLECTION_VALID", itemGroupCollectionValid);
    Debugger.log(
      "ITEM_GROUP_COLLECTION_UER_VALID",
      itemGroupCollectionUserValid
    );
  }
  if (
    !itemGroupUserGroupValid ||
    !itemGroupCollectionValid ||
    !itemGroupCollectionUserValid
  ) {
    return {
      isValid: false,
      error: ErrorName.ItemGroupInvalidGroupAcceptSignature,
    };
  }
  const usersProposeSignaturesValid =
    await areItemGroupUsersProposeSignaturesValid(
      itemGroup.users,
      itemGroupKey
    );
  if (doDebug) {
    Debugger.log("USERS_PROPOSE_SIGNATURES_VALID", usersProposeSignaturesValid);
  }
  if (!usersProposeSignaturesValid) {
    return {
      isValid: false,
      error: ErrorName.ItemGroupInvalidUserProposeSignature,
    };
  }
  const groupMembersProposeSignaturesValid =
    await areItemGroupGroupMembersProposeSignaturesValid(
      itemGroup.groups,
      itemGroupKey
    );
  const collectionMembersProposeSignaturesValid =
    await areItemGroupCollectionMembersProposeSignaturesValid(
      itemGroupWithCollections.collections,
      itemGroupKey
    );
  if (doDebug) {
    Debugger.log(
      "GROUP_MEMBERS_PROPOSE_SIGNATURES_VALID",
      groupMembersProposeSignaturesValid
    );
    Debugger.log(
      "COLLECTION_MEMBERS_PROPOSE_SIGNATURES_VALID",
      collectionMembersProposeSignaturesValid
    );
  }
  if (
    !groupMembersProposeSignaturesValid ||
    !collectionMembersProposeSignaturesValid
  ) {
    return {
      isValid: false,
      error: ErrorName.ItemGroupInvalidGroupProposeSignature,
    };
  }
  const itemGroupItemKeys = await areItemGroupItemKeysValid(
    itemGroup.items || [],
    itemGroupKey
  );
  if (doDebug) {
    Debugger.log("ITEM_GROUP_ITEM_KEYS", !!itemGroupItemKeys);
  }
  if (!itemGroupItemKeys) {
    return {
      isValid: false,
      error: ErrorName.ItemGroupInvalidKey,
    };
  }
  return {
    isValid: true,
    itemKeys: itemGroupItemKeys,
  };
}
export async function getDecryptedItemGroupKey(
  itemGroup: ItemGroupDownload,
  userGroups: UserGroupDownload[],
  privateKey: string,
  userId: string
): Promise<string | null> {
  const itemGroupUser = findMyItemGroupUser(itemGroup, userId);
  const itemGroupUserGroupMember = findMyItemGroupUserGroupMember(
    itemGroup,
    userGroups,
    userId
  );
  if (!itemGroupUser && !itemGroupUserGroupMember) {
    return null;
  }
  const itemGroupKey = itemGroupUser
    ? await getDecryptedItemGroupKeyFromUser(itemGroupUser, privateKey)
    : await getDecryptedItemGroupKeyFromUserGroupMember(
        itemGroupUserGroupMember,
        userGroups,
        privateKey,
        userId
      );
  if (!itemGroupKey) {
    return null;
  }
  return itemGroupKey;
}
export async function isItemGroupUserValid(
  itemGroupId: string,
  itemGroupUser: UserDownload,
  privateKey: string,
  publicKey: string
): Promise<boolean> {
  try {
    const { status, acceptSignature, groupKey } = itemGroupUser;
    if (status !== "accepted") {
      return true;
    }
    const decryptedGroupKey =
      await makeCryptoService().asymmetricEncryption.decrypt(
        privateKey,
        groupKey
      );
    const personalSignatureValid = await isGroupSignatureValid(
      itemGroupId,
      acceptSignature,
      decryptedGroupKey,
      publicKey
    );
    return personalSignatureValid;
  } catch (error) {
    if (doDebug) {
      Debugger.log(`isGroupSignatureValid error: ${error}`);
    }
    return false;
  }
}
export async function isItemGroupUserGroupMemberValid(
  itemGroupId: string,
  itemGroupUserGroup: UserGroupMemberDownload,
  userGroups: UserGroupDownload[],
  privateKey: string,
  userId: string
): Promise<boolean> {
  try {
    const { status, acceptSignature, groupKey, groupId } = itemGroupUserGroup;
    if (status !== "accepted") {
      return true;
    }
    const userGroup = (userGroups || []).find(
      (u: UserGroupDownload) => u.groupId === groupId
    );
    if (!userGroup) {
      return false;
    }
    const { publicKey: userGroupPublicKey } = userGroup;
    const decryptedUserGroupPrivateKey = await getUserGroupPrivateKey(
      userGroup,
      privateKey,
      userId
    );
    if (!decryptedUserGroupPrivateKey) {
      return false;
    }
    const decryptedGroupKey =
      await makeCryptoService().asymmetricEncryption.decrypt(
        decryptedUserGroupPrivateKey,
        groupKey
      );
    const groupSignatureValid = await isGroupSignatureValid(
      itemGroupId,
      acceptSignature,
      decryptedGroupKey,
      userGroupPublicKey
    );
    return groupSignatureValid;
  } catch (error) {
    if (doDebug) {
      Debugger.log(`isItemGroupUserGroupMemberValid error: ${error}`);
    }
    return false;
  }
}
export async function isItemGroupCollectionMemberValid(
  itemGroupId: string,
  itemGroupCollectionMember: UserGroupCollectionMember,
  collections: CollectionDownload[],
  privateKey: string,
  userId: string
): Promise<boolean> {
  try {
    const collection = (collections || []).find(
      (c) => c.uuid === itemGroupCollectionMember.member.uuid
    );
    if (!collection) {
      return false;
    }
    let decryptedCollectionPrivateKey = null;
    const { status, acceptSignature } = itemGroupCollectionMember.member;
    const { publicKey: collectionPublicKey } = collection;
    if (status !== "accepted") {
      return true;
    }
    if (itemGroupCollectionMember.userGroup) {
      const userGroupCollectionDownload = collection.userGroups.find(
        (ug) => ug.uuid === itemGroupCollectionMember.userGroup.groupId
      );
      if (!userGroupCollectionDownload) {
        return null;
      }
      decryptedCollectionPrivateKey =
        await getDecryptedPrivateCollectionKeyFromUserGroup(
          collection,
          itemGroupCollectionMember.userGroup,
          privateKey,
          userId
        );
    } else {
      decryptedCollectionPrivateKey = await getCollectionPrivateKeyForUser(
        collection,
        privateKey,
        userId
      );
    }
    if (!decryptedCollectionPrivateKey) {
      return false;
    }
    const itemGroupKey = await decryptGroupKey(
      itemGroupCollectionMember.member.itemGroupKey,
      decryptedCollectionPrivateKey
    );
    if (!itemGroupKey) {
      return false;
    }
    const collectionSignatureValid = await isGroupSignatureValid(
      itemGroupId,
      acceptSignature,
      itemGroupKey,
      collectionPublicKey
    );
    return collectionSignatureValid;
  } catch (error) {
    if (doDebug) {
      Debugger.log(`isItemGroupCollectionMemberValid error: ${error}`);
    }
    return false;
  }
}
export async function areItemGroupUsersProposeSignaturesValid(
  users: UserDownload[],
  itemGroupKey: string
): Promise<boolean> {
  const validityPromises = (users || [])
    .filter(({ status }) => ["pending", "accepted"].includes(status))
    .map((user: UserDownload) =>
      isItemGroupUserProposeSignatureValid(user, itemGroupKey)
    );
  const validities = await Promise.all(validityPromises);
  return validities.every(Boolean);
}
export async function isItemGroupUserProposeSignatureValid(
  user: UserDownload,
  itemGroupKey: string
): Promise<boolean> {
  try {
    return await makeCryptoService().symmetricEncryption.verifyHmacSHA256(
      itemGroupKey,
      user.proposeSignature,
      base64.encode(user.userId)
    );
  } catch (error) {
    if (doDebug) {
      Debugger.warn(
        `[SharingValidationService] - isItemGroupUserProposeSignatureValid: ${error}`
      );
    }
    return false;
  }
}
export async function areItemGroupGroupMembersProposeSignaturesValid(
  userGroupMembers: UserGroupMemberDownload[],
  itemGroupKey: string
): Promise<boolean> {
  const validityPromises = (userGroupMembers || [])
    .filter(({ status }) => ["pending", "accepted"].includes(status))
    .map((userGroupMember: UserGroupMemberDownload) =>
      isItemGroupGroupMemberProposeSignatureValid(userGroupMember, itemGroupKey)
    );
  const validities = await Promise.all(validityPromises);
  return validities.every(Boolean);
}
export async function areItemGroupCollectionMembersProposeSignaturesValid(
  collectionMembers: UserGroupCollectionDownload[],
  itemGroupKey: string
): Promise<boolean> {
  const validityPromises = (collectionMembers || [])
    .filter(({ status }) => ["pending", "accepted"].includes(status))
    .map((collectionMember) =>
      isItemGroupCollectionProposeSignatureValid(collectionMember, itemGroupKey)
    );
  const validities = await Promise.all(validityPromises);
  return validities.every(Boolean);
}
export async function isItemGroupGroupMemberProposeSignatureValid(
  userGroupMember: UserGroupMemberDownload,
  itemGroupKey: string
): Promise<boolean> {
  try {
    return await makeCryptoService().symmetricEncryption.verifyHmacSHA256(
      itemGroupKey,
      userGroupMember.proposeSignature,
      base64.encode(userGroupMember.groupId)
    );
  } catch {
    return false;
  }
}
export async function isItemGroupCollectionProposeSignatureValid(
  collectionMember: UserGroupCollectionDownload,
  itemGroupKey: string
): Promise<boolean> {
  try {
    return await makeCryptoService().symmetricEncryption.verifyHmacSHA256(
      itemGroupKey,
      collectionMember.proposeSignature,
      base64.encode(collectionMember.uuid)
    );
  } catch {
    return false;
  }
}
export async function areItemGroupItemKeysValid(
  items: ItemKey[],
  itemGroupKey: string
): Promise<false | ItemKeys> {
  const promises = (items || []).map((item: ItemKey) =>
    isItemGroupItemValid(item, itemGroupKey)
  );
  const results = await Promise.all(promises);
  return results.every(Boolean)
    ? results.reduce((acc, val, i) => ({ ...acc, [items[i].itemId]: val }), {})
    : false;
}
async function isItemGroupItemValid(
  item: ItemKey,
  itemGroupKey: string
): Promise<false | string> {
  try {
    const { itemKey } = item;
    return await decryptItemKey(itemKey, itemGroupKey);
  } catch {
    return false;
  }
}
export async function isUserGroupValid(
  userGroup: UserGroupDownload,
  privateKey: string,
  publicKey: string,
  userId: string
): Promise<boolean> {
  const { groupId } = userGroup;
  const meInUserGroup = (userGroup.users || []).find(
    (u) => u.userId === userId
  );
  if (!meInUserGroup) {
    return null;
  }
  const decryptedUserGroupKey = await getDecryptedUserGroupKey(
    meInUserGroup.groupKey,
    privateKey
  );
  if (!decryptedUserGroupKey) {
    return false;
  }
  const personalSignatureValid =
    !meInUserGroup.acceptSignature ||
    (await isGroupSignatureValid(
      groupId,
      meInUserGroup.acceptSignature,
      decryptedUserGroupKey,
      publicKey
    ));
  if (!personalSignatureValid) {
    return false;
  }
  const userGroupUsersProposeSignaturesValid =
    await areUserGroupUsersProposeSignaturesValid(
      userGroup.users,
      decryptedUserGroupKey
    );
  if (!userGroupUsersProposeSignaturesValid) {
    return false;
  }
  return true;
}
export async function isCollectionValid(
  collection: CollectionDownload,
  privateKey: string,
  publicKey: string,
  userId: string,
  userGroups: UserGroupDownload[]
): Promise<boolean> {
  const { uuid } = collection;
  const meInCollection = (collection.users || []).find(
    (u) => u.login === userId
  );
  let collectionKey = meInCollection?.collectionKey;
  let acceptSignature = meInCollection?.acceptSignature;
  let privateKeyToUse = privateKey;
  let publicKeyToUse = publicKey;
  if (!meInCollection) {
    const userGroupIdsInCollection = collection.userGroups.map(
      (group) => group.uuid
    );
    const userGroupsInCollection = userGroups.filter((group) =>
      userGroupIdsInCollection.includes(group.groupId)
    );
    const userGroupContainingMe = userGroupsInCollection.find((group) =>
      group.users.find((user) => user.userId === userId)
    );
    const userGroupInCollectionContainingMe = collection.userGroups.find(
      (group) => group.uuid === userGroupContainingMe.groupId
    );
    if (!userGroupInCollectionContainingMe) {
      return false;
    }
    const userGroupPrivateKey = await getUserGroupPrivateKey(
      userGroupContainingMe,
      privateKey,
      userId
    );
    collectionKey = userGroupInCollectionContainingMe.collectionKey;
    acceptSignature = userGroupInCollectionContainingMe.acceptSignature;
    privateKeyToUse = userGroupPrivateKey;
    publicKeyToUse = userGroupContainingMe.publicKey;
  }
  const decryptedCollectionKey = await getDecryptedUserGroupKey(
    collectionKey,
    privateKeyToUse
  );
  if (!decryptedCollectionKey) {
    return false;
  }
  const personalSignatureValid =
    !acceptSignature ||
    (await isGroupSignatureValid(
      uuid,
      acceptSignature,
      decryptedCollectionKey,
      publicKeyToUse
    ));
  if (!personalSignatureValid) {
    return false;
  }
  const userGroupUsersProposeSignaturesValid =
    await areCollectionUsersProposeSignaturesValid(
      collection,
      decryptedCollectionKey
    );
  if (!userGroupUsersProposeSignaturesValid) {
    return false;
  }
  return true;
}
