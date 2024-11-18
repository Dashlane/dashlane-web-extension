import { flatten, uniqBy } from "ramda";
import { firstValueFrom } from "rxjs";
import { GetSharing } from "@dashlane/sharing/types/getSharing";
import {
  ApplicationModulesAccess,
  Credential,
  ExceptionCriticality,
  isCredential,
  isNote,
  isSecret,
  Note,
  PendingItemGroup,
  PendingUserGroup,
  Secret,
} from "@dashlane/communication";
import { isSuccess } from "@dashlane/framework-types";
import { ErrorName, Trigger } from "@dashlane/hermes";
import {
  ItemContent,
  ItemGroupDownload,
  ItemKey,
  ServerResponse,
  UserDownload,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import {
  CollectionDownload,
  ItemGroupDownload as NewItemGroupDownload,
} from "@dashlane/server-sdk/v1";
import {
  CollectionSummary,
  ItemGroupSummary,
  ItemSummary,
  Sharing2Summary,
  SharingData,
  UserGroupSummary,
} from "Session/Store/sharingData/types";
import {
  setAllPendingAction,
  SharingSyncState,
  updateAllPendingAction,
} from "Session/Store/sharingSync";
import { StoreService } from "Store/index";
import { WSService } from "Libs/WS/index";
import {
  getDecryptedItemGroupKey,
  InvalidItemGroupError,
  isCollectionValid,
  isItemGroupUserProposeSignatureValid,
  IsItemGroupValidResult,
  isUserGroupValid,
  ItemKeys,
  validateItemGroup,
  ValidItemGroupResult,
} from "Sharing/2/Services/SharingValidationService";
import {
  decryptItemKey,
  getDecipheredItemKey,
  getItemGroupKey,
  getItemGroupPendingUserMember,
  isItemGroupAccepted,
  isItemWithoutItemGroup,
  isLastActiveUserInItemGroupAndAdmin,
} from "Sharing/2/Services/SharingHelpers";
import { findItemItemGroup } from "./itemGroupHelpers";
import {
  createOrUpdateItemEffect,
  deleteItemEffect,
  deleteSingleUserItemGroup,
  getPendingItemGroup,
  resendPublicKeyInvite,
  updateSharingData,
} from "Sharing/2/Services/SharingSyncJobsService";
import Debugger from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { assertUnreachable } from "Helpers/assert-unreachable";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { ukiSelector } from "Authentication/selectors";
import { asyncFilter } from "Helpers/async-filter";
import { EventLoggerService } from "Logs/EventLogger";
import {
  isUserItemGroupAdmin,
  revokeItemGroupMember,
} from "./SharingUserActionsService";
import { makeFeatureFlipsSelectors } from "Feature/selectors";
const doDebug = false;
interface SyncSharingOperations {
  storeService: StoreService;
  wsService: WSService;
  localStorageService: LocalStorageService;
  eventLoggerService: EventLoggerService;
  applicationModulesAccess?: ApplicationModulesAccess;
}
type SharingSyncStep = (...args: [SharingSync]) => Promise<SharingSync>;
export async function syncSharing(
  {
    storeService,
    wsService,
    localStorageService,
    eventLoggerService,
    applicationModulesAccess,
  }: SyncSharingOperations,
  sharing2Summary: Sharing2Summary,
  onInvalidData?: (itemGroupId: string, errorName: ErrorName) => void,
  trigger?: Trigger
): Promise<SharingData> {
  try {
    const uki = ukiSelector(storeService.getState());
    const login = storeService.getUserLogin();
    const { privateKey, publicKey } = storeService.getUserSession().keyPair;
    const { credentials, notes, secrets } = storeService.getPersonalData();
    const sharingData = storeService.getSharingData();
    const { queries } =
      applicationModulesAccess.createClients().sharingCollections;
    const sharedCollections = await firstValueFrom(
      queries.getSharedCollections({})
    );
    sharingData.collections =
      isSuccess(sharedCollections) && Array.isArray(sharedCollections.data)
        ? sharedCollections.data
        : [];
    const sanitizedCredentials = sanitizeList<Credential>(
      credentials,
      "PersonalData.credentials",
      isCredential
    );
    const sanitizedNotes = sanitizeList<Note>(
      notes,
      "PersonalData.notes",
      isNote
    );
    const sanitizedSecrets = sanitizeList<Secret>(
      secrets,
      "PersonalData.secrets",
      isSecret
    );
    const sanitizedItems = [
      ...sanitizedCredentials,
      ...sanitizedNotes,
      ...sanitizedSecrets,
    ];
    const personalDataItemIds = sanitizedItems.map((i) => i.Id);
    const personalDataById = sanitizedItems.reduce((byId, item) => {
      byId[item.Id] = item;
      return byId;
    }, {});
    const sharingSync: SharingSync = {
      itemKeys: {},
      loadedElements: getEmptySharingData(),
      sharing2Summary,
      sharingData,
      operations: getEmptyOperations(),
      personalDataItemIds,
      pendingUserGroups: [],
      pendingItemGroups: [],
      invalidItemGroups: [],
      autoRevokedUsers: [],
    };
    const upToDateSharingSync = await Promise.resolve(sharingSync)
      .then(report("sanitizeData", sanitizeData))
      .then(report("setOperations", setOperations))
      .then(report("setGetSharingParams", setGetSharingParams))
      .then(
        report("getSharing", (sharingSync) =>
          getSharing(sharingSync, wsService, login, uki)
        )
      )
      .then(
        report("filterOutInvalidOperations", (sharingSync) =>
          filterOutInvalidOperations(
            sharingSync,
            privateKey,
            publicKey,
            login,
            onInvalidData
          )
        )
      )
      .then(
        report("revokeUsersFromInvalidItemGroups", (sharingSync) =>
          revokeUsersFromInvalidItemGroups(
            storeService,
            applicationModulesAccess,
            wsService,
            sharingSync,
            privateKey,
            publicKey,
            login,
            trigger
          )
        )
      )
      .then(
        report("setMissingItemKeys", (sharingSync) =>
          setMissingItemKeys(sharingSync, privateKey, login)
        )
      )
      .then(
        report("tagConfirmableItemOperation", (sharingSync) =>
          tagConfirmableOperations(sharingSync, login)
        )
      )
      .then(
        report("setPendingItemGroupsList", (sharingSync) =>
          setPendingItemGroupsList(
            sharingSync,
            login,
            privateKey,
            personalDataById
          )
        )
      )
      .then(
        report("runOperationsEffects", (sharingSync) =>
          runOperationsEffects(sharingSync, {
            storeService,
            wsService,
            eventLoggerService,
            applicationModulesAccess,
          })
        )
      )
      .then(
        report("applyOperationsToSharingData", applyOperationsToSharingData)
      )
      .then(
        report("setPendingUserGroupsList", (sharingSync) =>
          setPendingUserGroupsList(sharingSync, storeService, login)
        )
      )
      .then(
        report("setPendingCollectionsList", (sharingSync) =>
          setPendingCollectionsList(sharingSync, applicationModulesAccess)
        )
      )
      .then(
        report("initSharingSyncFromStorage", (sharingSync) =>
          initSharingSyncFromStorage(
            sharingSync,
            storeService,
            localStorageService
          )
        )
      )
      .then(
        report("updateStoreSharingSync", (sharingSync) =>
          updateStoreSharingSync(sharingSync, storeService)
        )
      )
      .then(
        report("putSharingSyncBackInStorage", (sharingSync) =>
          putSharingSyncBackInStorage(
            sharingSync,
            storeService,
            localStorageService
          )
        )
      )
      .then(
        report("updateSharingDataFromSync", (sharingSync) =>
          updateSharingDataFromSync(sharingSync, storeService)
        )
      )
      .then(
        report("updateSharedCollectionsInModule", (sharingSync) =>
          updateSharedCollectionsInModule(
            sharingSync,
            login,
            applicationModulesAccess
          )
        )
      );
    return upToDateSharingSync.sharingData;
  } catch (error) {
    const message = `[SharingSync] - syncSharing failed: ${error}`;
    const augmentedError = new Error(message);
    if (doDebug) {
      Debugger.error(augmentedError);
    }
    sendExceptionLog({ error: augmentedError });
    return storeService.getSharingData();
  }
}
function report(label: string, cb: SharingSyncStep): SharingSyncStep {
  if (!doDebug) {
    return cb;
  }
  return (...args: [SharingSync]) => {
    console.time(label);
    return cb(...args).then((sharingSync) => {
      Debugger.warn(`Step "${label}" returned:`, sharingSync);
      console.timeEnd(label);
      return sharingSync;
    });
  };
}
export interface GetSharingParams {
  collectionIds?: string[];
  itemIds: string[];
  itemGroupIds: string[];
  userGroupIds: string[];
}
type GetSharingWithCollections = GetSharing & {
  collectionIds?: string[];
};
type ServerResponseCollections = ServerResponse & {
  collections: CollectionDownload[];
};
type SharingField = keyof SharingData;
export enum OperationType {
  Create,
  Update,
  Delete,
}
export interface Operation {
  type: OperationType;
  id: string;
  userConfirmationRequired?: boolean;
  skipPersonalDataItemCreation?: boolean;
  deleteSharingDataItems?: boolean;
}
export type Operations = {
  collections?: Operation[];
  items: Operation[];
  itemGroups: Operation[];
  userGroups: Operation[];
};
export type InvalidItemGroup = {
  error: InvalidItemGroupError;
  itemGroupId: string;
};
export type RevokedItemGroupUser = {
  user: UserDownload;
  itemGroup: ItemGroupDownload;
};
export interface SharingSync {
  getSharingParams?: GetSharingParams;
  itemKeys: ItemKeys;
  loadedElements: SharingData;
  sharing2Summary: Sharing2Summary;
  sharingData: SharingData;
  operations: Operations;
  personalDataItemIds: string[];
  pendingUserGroups: PendingUserGroup[];
  pendingItemGroups: PendingItemGroup[];
  invalidItemGroups: InvalidItemGroup[];
  autoRevokedUsers: RevokedItemGroupUser[];
}
export async function sanitizeData(
  sharingSync: SharingSync
): Promise<SharingSync> {
  const {
    sharingData: {
      collections: sharingCollections,
      items: sharingDataItems,
      itemGroups: sharingDataItemGroups,
      userGroups: sharingDataUserGroups,
    },
    sharing2Summary: {
      collections: summaryCollections,
      items: summaryItems,
      itemGroups: summaryItemGroups,
      userGroups: summaryUserGroups,
    },
  } = sharingSync;
  return {
    ...sharingSync,
    sharingData: {
      collections: sanitizeList(sharingCollections, "sharingData.collections"),
      items: sanitizeList(sharingDataItems, "sharingData.items"),
      itemGroups: sanitizeList(sharingDataItemGroups, "sharingData.itemGroups"),
      userGroups: sanitizeList(sharingDataUserGroups, "sharingData.userGroups"),
    },
    sharing2Summary: {
      collections: sanitizeList(
        summaryCollections,
        "sharing2Summary.collections"
      ),
      items: sanitizeList(summaryItems, "sharing2Summary.items"),
      itemGroups: sanitizeList(summaryItemGroups, "sharing2Summary.itemGroups"),
      userGroups: sanitizeList(summaryUserGroups, "sharing2Summary.userGroups"),
    },
  };
}
function sanitizeList<T>(
  list: T[],
  label: string,
  validator?: (e: T) => boolean
): T[] {
  const loggerValidator = getLoggerValidator(validator || Boolean, label);
  return (list || []).filter(loggerValidator);
}
function getLoggerValidator<T>(
  validator: (e: T) => boolean,
  label: string
): (e: T) => boolean {
  return (e: T): boolean => {
    if (validator(e)) {
      return true;
    }
    const message = `[SharingSync] - sanitizeList: found invalid element "${e}" in "${label}", filtering it out.`;
    sendExceptionLog({ message });
    return false;
  };
}
export async function setOperations(
  sharingSync: SharingSync
): Promise<SharingSync> {
  const { sharingData, personalDataItemIds } = sharingSync;
  const items = sharingData.items;
  const itemsSummary = sharingSync.sharing2Summary.items;
  const itemOperations = getOperations<ItemContent, ItemSummary>(
    items,
    itemsSummary,
    "itemId",
    "timestamp"
  ).map((o) =>
    o.type === OperationType.Create && personalDataItemIds.includes(o.id)
      ? { ...o, skipPersonalDataItemCreation: true }
      : o
  );
  const itemGroups = sharingData.itemGroups;
  const itemGroupsSummary = sharingSync.sharing2Summary.itemGroups;
  const itemGroupsOperations = getOperations<
    ItemGroupDownload,
    ItemGroupSummary
  >(itemGroups, itemGroupsSummary, "groupId", "revision");
  const userGroups = sharingData.userGroups;
  const userGroupsSummary = sharingSync.sharing2Summary.userGroups;
  const userGroupsOperations = getOperations<
    UserGroupDownload,
    UserGroupSummary
  >(userGroups, userGroupsSummary, "groupId", "revision");
  const collections = sharingData.collections;
  const collectionsSummary = sharingSync.sharing2Summary.collections;
  const collectionsOperations = getOperations<
    CollectionDownload,
    CollectionSummary
  >(collections, collectionsSummary, "uuid", "revision");
  return {
    ...sharingSync,
    operations: {
      items: itemOperations,
      itemGroups: itemGroupsOperations,
      userGroups: userGroupsOperations,
      collections: collectionsOperations,
    },
  };
}
function getOperations<
  Element,
  Summary extends {
    id: string;
  }
>(
  elements: Element[],
  summary: Summary[],
  idField: string,
  revisionKey: string
): Operation[] {
  const { elementsToCreate } = findElementsToCreate<Element, Summary>(
    elements,
    summary,
    idField
  );
  const { elementsToUpdate, elementsToDelete } = findElementsToUpdateAndDelete<
    Element,
    Summary
  >(elements, summary, idField, revisionKey);
  return []
    .concat(elementsToCreate.map((id) => ({ id, type: OperationType.Create })))
    .concat(elementsToUpdate.map((id) => ({ id, type: OperationType.Update })))
    .concat(elementsToDelete.map((id) => ({ id, type: OperationType.Delete })));
}
function findElementsToCreate<
  Element,
  Summary extends {
    id: string;
  }
>(
  elements: Element[],
  summary: Summary[],
  idField: string
): {
  elementsToCreate: string[];
} {
  const ids = elements.map((e) => e[idField]);
  const summaryIds = summary.map((s) => s.id);
  const elementsToCreate = summaryIds.filter((id) => !ids.includes(id));
  return { elementsToCreate };
}
function findElementsToUpdateAndDelete<
  Element,
  Summary extends {
    id: string;
  }
>(
  elements: Element[],
  summary: Summary[],
  idField: string,
  revisionKey: string
): {
  elementsToUpdate: string[];
  elementsToDelete: string[];
} {
  const summaryIds = summary.map((s) => s.id);
  const initialOutput = {
    elementsToUpdate: [] as string[],
    elementsToDelete: [] as string[],
  };
  return elements.reduce((output, e) => {
    const ix = summaryIds.indexOf(e[idField]);
    if (ix < 0) {
      return {
        ...output,
        elementsToDelete: [...output.elementsToDelete, e[idField] as string],
      };
    }
    const summaryItem = summary[ix];
    if (summaryItem[revisionKey] > e[revisionKey]) {
      return {
        ...output,
        elementsToUpdate: [...output.elementsToUpdate, e[idField] as string],
      };
    }
    return output;
  }, initialOutput);
}
export async function tagConfirmableOperations(
  sharingSync: SharingSync,
  userId: string
): Promise<SharingSync> {
  const {
    operations: { items: itemOperations },
    loadedElements: {
      collections: loadedCollections,
      itemGroups: loadedItemGroups,
      userGroups: loadedUserGroups,
    },
    sharingData: {
      collections: sharingDataCollections,
      itemGroups: sharingDataItemGroups,
      userGroups: sharingDataUserGroups,
    },
  } = sharingSync;
  const itemGroups = uniqBy(
    (itemGroup: ItemGroupDownload) => itemGroup.groupId,
    loadedItemGroups.concat(sharingDataItemGroups)
  );
  const userGroups = uniqBy(
    (userGroup: UserGroupDownload) => userGroup.groupId,
    loadedUserGroups.concat(sharingDataUserGroups)
  );
  const collections = uniqBy(
    (collection: CollectionDownload) => collection.uuid,
    loadedCollections.concat(sharingDataCollections)
  );
  const taggedItemOperations = itemOperations.map((operation: Operation) =>
    tagConfirmableItemOperation(
      operation,
      userId,
      itemGroups,
      userGroups,
      collections
    )
  );
  return {
    ...sharingSync,
    operations: {
      ...sharingSync.operations,
      items: taggedItemOperations,
    },
  };
}
function tagConfirmableItemOperation(
  operation: Operation,
  userId: string,
  itemGroups: ItemGroupDownload[],
  userGroups: UserGroupDownload[],
  collections: CollectionDownload[]
): Operation {
  if (operation.type !== OperationType.Create) {
    return operation;
  }
  const itemGroup = (itemGroups || []).find((iG) =>
    (iG.items || []).map((i) => i.itemId).includes(operation.id)
  );
  if (!itemGroup) {
    return operation;
  }
  const accepted = isItemGroupAccepted(
    itemGroup,
    userGroups,
    userId,
    collections
  );
  const operationConfirmed = accepted
    ? operation
    : {
        ...operation,
        userConfirmationRequired: true,
      };
  return operationConfirmed;
}
export async function setGetSharingParams(
  sharingSync: SharingSync
): Promise<SharingSync> {
  const getSharingParams = (field: SharingField) =>
    sharingSync.operations[field]
      .filter((o: Operation) =>
        [OperationType.Create, OperationType.Update].includes(o.type)
      )
      .map((o: Operation) => o.id);
  return {
    ...sharingSync,
    getSharingParams: {
      collectionIds: getSharingParams("collections"),
      itemIds: getSharingParams("items"),
      itemGroupIds: getSharingParams("itemGroups"),
      userGroupIds: getSharingParams("userGroups"),
    },
  };
}
export async function getSharing(
  sharingSync: SharingSync,
  wsService: WSService,
  login: string,
  uki: string
): Promise<SharingSync> {
  const data = Object.assign({}, sharingSync.getSharingParams, {
    type: "getSharing",
    sharingVersion: 4,
  }) as GetSharingWithCollections;
  if (
    !(
      data.collectionIds.length ||
      data.itemIds.length ||
      data.itemGroupIds.length ||
      data.userGroupIds.length
    )
  ) {
    return sharingSync;
  }
  const {
    collections,
    itemErrors,
    items,
    itemGroupErrors,
    itemGroups,
    userGroupErrors,
    userGroups,
  } = (await wsService.sharing.get(
    login,
    uki,
    data
  )) as ServerResponseCollections;
  if (itemErrors && itemErrors.length) {
    throw new Error(
      `[SharingSync] - getSharing itemErrors: ${itemErrors[0].message}`
    );
  }
  if (itemGroupErrors && itemGroupErrors.length) {
    throw new Error(
      `[SharingSync] - getSharing itemGroupErrors: ${itemGroupErrors[0].message}`
    );
  }
  if (userGroupErrors && userGroupErrors.length) {
    throw new Error(
      `[SharingSync] - getSharing userGroupErrors: ${userGroupErrors[0].message}`
    );
  }
  return {
    ...sharingSync,
    loadedElements: {
      collections: sanitizeList(collections, "getSharing loaded collections"),
      items: sanitizeList(items, "getSharing loaded items"),
      itemGroups: sanitizeList(itemGroups, "getSharing loaded itemGroups"),
      userGroups: sanitizeList(userGroups, "getSharing loaded userGroups"),
    },
  };
}
export async function filterOutInvalidOperations(
  sharingSync: SharingSync,
  privateKey: string,
  publicKey: string,
  userId: string,
  onInvalidData?: (itemGroupId: string, errorName: ErrorName) => void
): Promise<SharingSync> {
  const {
    sharingData: { collections, userGroups },
    loadedElements: {
      collections: loadedCollections,
      itemGroups: loadedItemGroups,
      userGroups: loadedUserGroups,
    },
    operations: {
      collections: collectionsOperations,
      itemGroups: itemGroupOperations,
      userGroups: userGroupOperations,
    },
  } = sharingSync;
  const validLoadedUserGroups = await asyncFilter(
    loadedUserGroups,
    (userGroup: UserGroupDownload) =>
      isUserGroupValid(userGroup, privateKey, publicKey, userId)
  );
  const validLoadedUserGroupIds = validLoadedUserGroups.map((i) => i.groupId);
  const validUserGroupOperations = userGroupOperations.filter(
    (o) =>
      o.type === OperationType.Delete || validLoadedUserGroupIds.includes(o.id)
  );
  const allUserGroups = validLoadedUserGroups.concat(userGroups);
  const validLoadedCollections = await asyncFilter(
    loadedCollections,
    (collection: CollectionDownload) =>
      isCollectionValid(
        collection,
        privateKey,
        publicKey,
        userId,
        allUserGroups
      )
  );
  const validLoadedCollectionIds = validLoadedCollections.map((i) => i.uuid);
  const validCollectionOperations = collectionsOperations.filter(
    (o) =>
      o.type === OperationType.Delete || validLoadedCollectionIds.includes(o.id)
  );
  const allCollections = validLoadedCollections.concat(collections);
  const {
    validItemGroups: validLoadedItemGroups,
    itemKeys,
    invalidItemGroups,
  } = await asyncFilterItemGroups(
    loadedItemGroups,
    (itemGroup: ItemGroupDownload) =>
      validateItemGroup(
        itemGroup,
        allUserGroups,
        privateKey,
        publicKey,
        userId,
        findRelevantCollectionsForItemGroup(
          itemGroup as NewItemGroupDownload,
          allCollections
        )
      )
  );
  const validLoadedItemGroupIds = validLoadedItemGroups.map((i) => i.groupId);
  const validItemGroupOperations = itemGroupOperations.filter(
    (o) =>
      o.type === OperationType.Delete || validLoadedItemGroupIds.includes(o.id)
  );
  if (invalidItemGroups && invalidItemGroups.length > 0) {
    invalidItemGroups.forEach((invalidItemGroup) => {
      onInvalidData?.(invalidItemGroup.itemGroupId, invalidItemGroup.error);
    });
  }
  return {
    ...sharingSync,
    itemKeys,
    operations: {
      ...sharingSync.operations,
      collections: validCollectionOperations,
      userGroups: validUserGroupOperations,
      itemGroups: validItemGroupOperations,
    },
    invalidItemGroups,
  };
}
export async function asyncFilterItemGroups(
  itemGroups: ItemGroupDownload[],
  handler: (i: ItemGroupDownload) => Promise<IsItemGroupValidResult>
): Promise<{
  validItemGroups: ItemGroupDownload[];
  itemKeys: ItemKeys;
  invalidItemGroups: InvalidItemGroup[];
}> {
  const results = await Promise.all(itemGroups.map(handler));
  const validItemGroups = itemGroups.filter(
    (_itemGroup, i) => results[i].isValid
  );
  const isValidResult = (
    result: IsItemGroupValidResult
  ): result is ValidItemGroupResult => result.isValid;
  const validResults = results.filter(isValidResult);
  const itemKeys = validResults.reduce(
    (acc, res) => ({ ...acc, ...res.itemKeys }),
    {}
  );
  const invalidItemGroups = results.flatMap((result, i) =>
    result.isValid === false
      ? [
          {
            itemGroupId: itemGroups[i].groupId,
            error: result.error,
          },
        ]
      : []
  );
  return { validItemGroups, itemKeys, invalidItemGroups };
}
function findRelevantUserGroupsForItemGroup(
  itemGroup: ItemGroupDownload,
  userGroups: UserGroupDownload[]
): UserGroupDownload[] {
  const relevantUserGroupIds = (itemGroup.groups || []).map((g) => g.groupId);
  return userGroups.filter((u) => relevantUserGroupIds.includes(u.groupId));
}
function findRelevantCollectionsForItemGroup(
  itemGroup: NewItemGroupDownload,
  collections: CollectionDownload[]
): CollectionDownload[] {
  const relevantCollectionIds = (itemGroup.collections || []).map(
    (collection) => collection.uuid
  );
  return collections.filter((collection) =>
    relevantCollectionIds.includes(collection.uuid)
  );
}
export async function shouldRunAutoRevoke(
  applicationModulesAccess: ApplicationModulesAccess,
  trigger?: Trigger
) {
  const featureFlips = await makeFeatureFlipsSelectors(
    applicationModulesAccess
  ).featureFlipsSelector();
  const autoRevokeFFEnabled =
    featureFlips["sharing_web_invalidSignatureAutoRevoke_prod"];
  const isLoginSync =
    trigger === Trigger.InitialLogin || trigger === Trigger.Login;
  return autoRevokeFFEnabled && isLoginSync;
}
export async function revokeUsersFromInvalidItemGroups(
  storeService: StoreService,
  applicationModulesAccess: ApplicationModulesAccess,
  wsService: WSService,
  sharingSync: SharingSync,
  privateKey: string,
  publicKey: string,
  userId: string,
  trigger?: Trigger
): Promise<SharingSync> {
  const shouldRunAutoRevokeStep = await shouldRunAutoRevoke(
    applicationModulesAccess,
    trigger
  );
  if (!shouldRunAutoRevokeStep) {
    return sharingSync;
  }
  const {
    sharingData: { userGroups },
    loadedElements: {
      itemGroups: loadedItemGroups,
      userGroups: loadedUserGroups,
    },
    invalidItemGroups,
  } = sharingSync;
  const invalidSignatureItemGroups = invalidItemGroups.filter(
    (invalidItemGroup) =>
      invalidItemGroup.error === ErrorName.ItemGroupInvalidUserProposeSignature
  );
  if (invalidSignatureItemGroups.length === 0) {
    return sharingSync;
  }
  const validLoadedUserGroups = await asyncFilter(
    loadedUserGroups,
    (userGroup: UserGroupDownload) =>
      isUserGroupValid(userGroup, privateKey, publicKey, userId)
  );
  const allUserGroups = validLoadedUserGroups.concat(userGroups);
  const administrativeGroups = invalidSignatureItemGroups
    .map((invalidItemGroup) =>
      loadedItemGroups.find(
        ({ groupId }) => groupId === invalidItemGroup.itemGroupId
      )
    )
    .filter(
      (itemGroup) =>
        itemGroup !== undefined &&
        isUserItemGroupAdmin(itemGroup, userGroups, userId)
    );
  if (administrativeGroups.length === 0) {
    return sharingSync;
  }
  const pendingUsersToVerify = administrativeGroups.flatMap((itemGroup) => {
    const pendingUsers = itemGroup.users.filter(
      (user) => user.status === "pending" && user.userId !== userId
    );
    return pendingUsers.map((user) => ({
      itemGroup,
      user,
    }));
  });
  const invalidProposals = (
    await Promise.all(
      pendingUsersToVerify.map(async (invalidProposal) => {
        const itemGroupKey = await getDecryptedItemGroupKey(
          invalidProposal.itemGroup,
          findRelevantUserGroupsForItemGroup(
            invalidProposal.itemGroup,
            allUserGroups
          ),
          privateKey,
          userId
        );
        const isValid = await isItemGroupUserProposeSignatureValid(
          invalidProposal.user,
          itemGroupKey
        );
        return isValid ? undefined : invalidProposal;
      })
    )
  ).filter((result) => result !== undefined);
  const autoRevokedUsers = await Promise.all(
    invalidProposals.map(
      async ({ user, itemGroup }): Promise<RevokedItemGroupUser> => {
        await revokeItemGroupMember(
          applicationModulesAccess,
          storeService,
          wsService,
          itemGroup,
          { type: "user", alias: user.alias }
        );
        return {
          user,
          itemGroup,
        };
      }
    )
  );
  return { ...sharingSync, autoRevokedUsers };
}
export async function setMissingItemKeys(
  sharingSync: SharingSync,
  privateKey: string,
  userId: string
): Promise<SharingSync> {
  const {
    loadedElements,
    sharingData: { collections, itemGroups, userGroups },
    itemKeys,
  } = sharingSync;
  const loneItems = loadedElements.items.filter((item: ItemContent) =>
    isItemWithoutItemGroup(item.itemId, loadedElements.itemGroups)
  );
  const loneItemsItemGroupsMap = loneItems.reduce((acc, item) => {
    const itemGroup = findItemItemGroup(item.itemId, itemGroups);
    return itemGroup ? { ...acc, [item.itemId]: { itemGroup } } : acc;
  }, {});
  const itemIds = Object.keys(loneItemsItemGroupsMap);
  const groupKeysPromises = itemIds.map((itemId) => {
    const { itemGroup } = loneItemsItemGroupsMap[itemId];
    return getItemGroupKey(
      itemGroup,
      userGroups,
      privateKey,
      userId,
      collections
    ).catch(() => null);
  });
  const groupKeyResults = await Promise.all(groupKeysPromises);
  const withGroupKeys = itemIds.reduce(
    (acc, itemId, index) => ({
      ...acc,
      [itemId]: {
        ...loneItemsItemGroupsMap[itemId],
        itemGroupKey: groupKeyResults[index],
      },
    }),
    {}
  );
  const newItemKeysPromises = itemIds.map((itemId) => {
    const { itemGroupKey, itemGroup } = withGroupKeys[itemId];
    if (!itemGroup) {
      return Promise.resolve(null);
    }
    const itemKey = (itemGroup.items || []).find(
      (i: ItemKey) => i.itemId === itemId
    );
    if (!itemKey) {
      return Promise.resolve(null);
    }
    return decryptItemKey(itemKey.itemKey, itemGroupKey).catch(() => null);
  });
  const newItemKeysResults = await Promise.all(newItemKeysPromises);
  const newItemKeys: ItemKeys = itemIds.reduce(
    (acc: ItemKeys, itemId: string, index: number) => {
      return newItemKeysResults[index]
        ? { ...acc, [itemId]: newItemKeysResults[index] }
        : acc;
    },
    {} as ItemKeys
  );
  return { ...sharingSync, itemKeys: { ...itemKeys, ...newItemKeys } };
}
interface SharingOperationServices {
  storeService: StoreService;
  wsService: WSService;
  eventLoggerService: EventLoggerService;
  applicationModulesAccess?: ApplicationModulesAccess;
}
export async function runOperationsEffects(
  sharingSync: SharingSync,
  {
    storeService,
    wsService,
    eventLoggerService,
    applicationModulesAccess,
  }: SharingOperationServices
): Promise<SharingSync> {
  const validItemOperations = await runItemOperationsEffects(
    storeService,
    sharingSync,
    applicationModulesAccess
  );
  const validItemGroupOperations = await runItemGroupOperationsEffects(
    {
      storeService,
      wsService,
      eventLoggerService,
      applicationModulesAccess,
    },
    sharingSync
  );
  return {
    ...sharingSync,
    operations: {
      ...sharingSync.operations,
      items: validItemOperations,
      itemGroups: validItemGroupOperations,
    },
  };
}
async function setPendingItemGroupsList(
  sharingSync: SharingSync,
  userId: string,
  privateKey: string,
  personalDataById: Record<string, Credential | Note | Secret>
): Promise<SharingSync> {
  const {
    loadedElements: { itemGroups: loadedItemGroups, items: loadedItems },
    sharingData: { itemGroups: sharingDataItemGroups, items: sharingDataItems },
    itemKeys,
  } = sharingSync;
  const itemGroups = uniqBy(
    (itemGroup: ItemGroupDownload) => itemGroup.groupId,
    loadedItemGroups.concat(sharingDataItemGroups)
  );
  const items = uniqBy(
    (item: ItemContent) => item.itemId,
    loadedItems.concat(sharingDataItems)
  );
  const pendingItemGroupPromises = itemGroups.reduce((acc, itemGroup) => {
    const userMember = getItemGroupPendingUserMember(itemGroup, userId);
    if (!userMember) {
      return acc;
    }
    const newPromises = getPendingItemGroupsFromItemGroup(
      itemGroup,
      userMember,
      privateKey,
      items,
      itemKeys,
      personalDataById
    );
    return [newPromises, ...acc];
  }, []);
  const pendingItemGroups = flatten(
    await Promise.all(pendingItemGroupPromises)
  );
  return { ...sharingSync, pendingItemGroups };
}
async function getPendingItemGroupsFromItemGroup(
  itemGroup: ItemGroupDownload,
  userMember: UserDownload,
  privateKey: string,
  items: ItemContent[],
  itemKeys: ItemKeys,
  personalDataById: Record<string, Credential | Note | Secret>
): Promise<PendingItemGroup[]> {
  const { permission, referrer, groupKey } = userMember;
  const promises = (itemGroup.items || []).map(async (itemKey: ItemKey) => {
    try {
      const { itemId } = itemKey;
      const itemKeyDeciphered =
        itemKeys[itemId] ||
        (await getDecipheredItemKey(groupKey, itemKey.itemKey, privateKey));
      if (!itemKeyDeciphered) {
        return null;
      }
      const item = items.find((item) => item.itemId === itemId);
      if (!item) {
        return null;
      }
      const pendingItemGroup = await getPendingItemGroup(
        item,
        itemKeyDeciphered,
        itemGroup.groupId,
        referrer,
        permission,
        personalDataById
      );
      return pendingItemGroup;
    } catch (_e) {
      return null;
    }
  });
  const results = await Promise.all(promises);
  return results.filter(Boolean);
}
async function setPendingUserGroupsList(
  sharingSync: SharingSync,
  storeService: StoreService,
  login: string
): Promise<SharingSync> {
  const {
    sharingData: { userGroups },
  } = sharingSync;
  const team = storeService
    .getSpaceData()
    .spaces.find((space) => space.details.status === "accepted");
  if (!team) {
    return { ...sharingSync, pendingUserGroups: [] };
  }
  const teamId = String(team.teamId);
  const pendingUserGroups = userGroups.reduce((acc, userGroup) => {
    const teamAccepted = String(userGroup.teamId) === teamId;
    if (!teamAccepted) {
      return acc;
    }
    const mePendingInUserGroup = (userGroup.users || []).find(
      (u) => u.userId === login && u.status === "pending"
    );
    if (!mePendingInUserGroup) {
      return acc;
    }
    const { groupId, name } = userGroup;
    const { referrer, permission } = mePendingInUserGroup;
    const pendingUserGroup = { groupId, name, referrer, permission };
    return [pendingUserGroup, ...acc];
  }, []);
  return { ...sharingSync, pendingUserGroups };
}
async function setPendingCollectionsList(
  sharingSync: SharingSync,
  applicationModulesAccess?: ApplicationModulesAccess
) {
  try {
    if (applicationModulesAccess) {
      const {
        sharingData: { collections },
      } = sharingSync;
      const { commands } =
        applicationModulesAccess.createClients().sharingInvites;
      commands.updatePendingCollections(collections);
    }
  } catch (error) {
    const message = `Set pending collections - sharing sync: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({
      error: augmentedError,
      code: ExceptionCriticality.WARNING,
    });
  }
  return sharingSync;
}
async function runItemOperationsEffects(
  storeService: StoreService,
  sharingSync: SharingSync,
  applicationModulesAccess?: ApplicationModulesAccess
): Promise<Operation[]> {
  const {
    itemKeys,
    loadedElements,
    operations: { items: itemOperations },
  } = sharingSync;
  const promises = itemOperations.map((operation) =>
    runSingleItemOperationEffect(
      storeService,
      loadedElements,
      operation,
      itemKeys
    )
  );
  const results = (await Promise.all(promises)).filter((x) => !!x);
  try {
    if (applicationModulesAccess && results.length > 0) {
      const { commands } =
        applicationModulesAccess.createClients().passwordHealth;
      commands.recalculatePasswordHealth();
    }
  } catch (error) {
    const message = `Password Health update - sharing: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({
      error: augmentedError,
      code: ExceptionCriticality.WARNING,
    });
  }
  return results;
}
async function runSingleItemOperationEffect(
  storeService: StoreService,
  loadedElements: SharingData,
  operation: Operation,
  itemKeys: ItemKeys
): Promise<Operation | null> {
  switch (operation.type) {
    case OperationType.Delete: {
      const success = await deleteItemEffect(storeService, operation.id);
      return success ? operation : null;
    }
    case OperationType.Create:
    case OperationType.Update: {
      if (operation.skipPersonalDataItemCreation) {
        return operation;
      }
      if (operation.userConfirmationRequired) {
        return null;
      }
      const item = loadedElements.items.find((i) => i.itemId === operation.id);
      if (!item) {
        return null;
      }
      const itemKey = itemKeys[item.itemId];
      if (!itemKey) {
        return null;
      }
      const success = await createOrUpdateItemEffect(
        storeService,
        item,
        itemKey
      );
      return success ? operation : null;
    }
  }
  return assertUnreachable(operation.type);
}
async function runItemGroupOperationsEffects(
  {
    storeService,
    wsService,
    eventLoggerService,
    applicationModulesAccess,
  }: SharingOperationServices,
  sharingSync: SharingSync
): Promise<Operation[]> {
  const {
    operations: { itemGroups: itemGroupOperations },
    loadedElements: {
      itemGroups: loadedItemGroups,
      userGroups: loadedUserGroups,
      collections: loadedCollections,
    },
    sharingData: {
      userGroups: sharingDataUserGroups,
      collections: sharingDataCollections,
    },
  } = sharingSync;
  const userGroups = uniqBy(
    (userGroup: UserGroupDownload) => userGroup.groupId,
    loadedUserGroups.concat(sharingDataUserGroups)
  );
  const collections = uniqBy(
    (collection: CollectionDownload) => collection.uuid,
    loadedCollections.concat(sharingDataCollections)
  );
  const promises = itemGroupOperations.map((operation) =>
    runSingleItemGroupOperationEffect(
      {
        storeService,
        wsService,
        eventLoggerService,
        applicationModulesAccess,
      },
      loadedItemGroups,
      userGroups,
      operation,
      collections
    )
  );
  const results = (await Promise.all(promises)).filter((x) => !!x);
  try {
    if (applicationModulesAccess && results.length > 0) {
      const { commands } =
        applicationModulesAccess.createClients().passwordHealth;
      commands.recalculatePasswordHealth();
    }
  } catch (error) {
    const message = `Password Health update - sharing: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({
      error: augmentedError,
      code: ExceptionCriticality.WARNING,
    });
  }
  return results;
}
async function runSingleItemGroupOperationEffect(
  {
    storeService,
    wsService,
    eventLoggerService,
    applicationModulesAccess,
  }: SharingOperationServices,
  loadedItemGroups: ItemGroupDownload[],
  userGroups: UserGroupDownload[],
  operation: Operation,
  collections?: CollectionDownload[]
): Promise<Operation | null> {
  const { type, id } = operation;
  const { login } = storeService.getAccountInfo();
  switch (type) {
    case OperationType.Delete:
      return operation;
    case OperationType.Create:
    case OperationType.Update: {
      const itemGroup = loadedItemGroups.find((iG) => iG.groupId === id);
      if (!itemGroup) {
        return null;
      }
      const publicKeyUsers = (itemGroup.users || []).filter(
        (user) => user.rsaStatus === "publicKey"
      );
      publicKeyUsers.forEach((user) =>
        resendPublicKeyInvite(storeService, user, itemGroup)
      );
      if (isLastActiveUserInItemGroupAndAdmin(itemGroup, login)) {
        const success = await deleteSingleUserItemGroup(
          {
            storeService,
            wsService,
            eventLoggerService,
            applicationModulesAccess,
            sharingItemsApi:
              applicationModulesAccess.createClients().sharingItems,
          },
          itemGroup
        );
        return success ? { ...operation, type: OperationType.Delete } : null;
      }
      if (!isItemGroupAccepted(itemGroup, userGroups, login, collections)) {
        const promises = (itemGroup.items || []).map(async ({ itemId }) => {
          try {
            return await deleteItemEffect(storeService, itemId);
          } catch (_err) {
            return null;
          }
        });
        await Promise.all(promises);
        return { ...operation, deleteSharingDataItems: true };
      }
      return operation;
    }
  }
  return assertUnreachable(type);
}
async function updateStoreSharingSync(
  sharingSync: SharingSync,
  storeService: StoreService
): Promise<SharingSync> {
  const { pendingItemGroups, pendingUserGroups } = sharingSync;
  const action = updateAllPendingAction(pendingItemGroups, pendingUserGroups);
  storeService.dispatch(action);
  return sharingSync;
}
export async function applyOperationsToSharingData(
  sharingSync: SharingSync
): Promise<SharingSync> {
  const {
    sharingData: {
      items: sharingItems,
      itemGroups: sharingItemGroups,
      userGroups: sharingUserGroups,
      collections: sharingCollections,
    },
    loadedElements: {
      items: loadedItems,
      itemGroups: loadedItemGroups,
      userGroups: loadedUserGroups,
      collections: loadedCollections,
    },
    operations: {
      items: itemOperations,
      itemGroups: itemGroupOperations,
      userGroups: userGroupOperations,
      collections: collectionsOperations,
    },
  } = sharingSync;
  const newSharingItems = applyElementOperations<ItemContent>(
    loadedItems,
    sharingItems,
    itemOperations
  );
  const newSharingItemGroups = applyElementOperations<ItemGroupDownload>(
    loadedItemGroups,
    sharingItemGroups,
    itemGroupOperations
  );
  const newSharingUserGroups = applyElementOperations<UserGroupDownload>(
    loadedUserGroups,
    sharingUserGroups,
    userGroupOperations
  );
  const newSharingCollections = applyElementOperations<CollectionDownload>(
    loadedCollections,
    sharingCollections,
    collectionsOperations
  );
  const itemsToRemoveFromItemGroupOperations: string[] = itemGroupOperations
    .filter(({ deleteSharingDataItems }) => deleteSharingDataItems)
    .reduce((items, { id }) => {
      const itemGroup = loadedItemGroups.find((iG) => iG.groupId === id);
      if (!itemGroup) {
        return items;
      }
      const itemIds = (itemGroup.items || []).map(({ itemId }) => itemId);
      return [...items, ...itemIds];
    }, []);
  const itemsAfterItemGroupOperations = newSharingItems.filter(
    (item) => !itemsToRemoveFromItemGroupOperations.includes(item.itemId)
  );
  return {
    ...sharingSync,
    sharingData: {
      items: itemsAfterItemGroupOperations,
      itemGroups: newSharingItemGroups,
      userGroups: newSharingUserGroups,
      collections: newSharingCollections,
    },
  };
}
function applyElementOperations<Element>(
  loadedElements: Element[],
  sharingElements: Element[],
  operations: Operation[]
): Element[] {
  return operations.reduce(
    (sharingElementsAcc, operation) =>
      applyElementOperation<Element>(
        loadedElements,
        sharingElementsAcc,
        operation
      ),
    sharingElements
  );
}
function applyElementOperation<Element>(
  loadedElements: Element[],
  sharingElements: Element[],
  operation: Operation
): Element[] {
  switch (operation.type) {
    case OperationType.Delete:
      return removeElement<Element>(sharingElements, operation);
    case OperationType.Create:
      return addElement<Element>(loadedElements, sharingElements, operation);
    case OperationType.Update:
      return updateElement<Element>(loadedElements, sharingElements, operation);
  }
  return assertUnreachable(operation.type);
}
function addElement<Element>(
  loadedElements: Element[],
  sharingElements: Element[],
  { id }: Operation
): Element[] {
  const loadedElement = loadedElements.find(
    (e: Element) => getId<Element>(e) === id
  );
  return loadedElement
    ? sharingElements.concat(loadedElement)
    : sharingElements;
}
function removeElement<Element>(
  sharingElements: Element[],
  { id }: Operation
): Element[] {
  return sharingElements.filter((e) => getId<Element>(e) !== id);
}
function updateElement<Element>(
  loadedElements: Element[],
  sharingElements: Element[],
  { id }: Operation
): Element[] {
  const loadedElement = loadedElements.find((e) => getId<Element>(e) === id);
  if (!loadedElement) {
    return sharingElements;
  }
  return sharingElements.map((e) =>
    getId<Element>(e) === id ? loadedElement : e
  );
}
function getId<Element>(element: Element) {
  if (instanceOfItem(element)) {
    return element.itemId;
  }
  if (instanceOfGroup(element)) {
    return element.groupId;
  }
  if (instanceOfCollection(element)) {
    return element.uuid;
  }
  function instanceOfItem(object: any): object is ItemContent {
    return "itemId" in object;
  }
  function instanceOfGroup(
    object: any
  ): object is ItemGroupDownload | UserGroupDownload {
    return "groupId" in object;
  }
  function instanceOfCollection(object: any): object is CollectionDownload {
    return "uuid" in object;
  }
}
export async function updateSharedCollectionsInModule(
  sharingSync: SharingSync,
  login: string,
  applicationModulesAccess?: ApplicationModulesAccess
) {
  try {
    if (applicationModulesAccess) {
      const {
        sharingData: { collections, userGroups },
      } = sharingSync;
      if (collections) {
        const acceptedCollections = collections.filter((collection) => {
          const hasAcceptedAsUser = (collection?.users ?? []).some(
            (user) => user.login === login && user.status === "accepted"
          );
          const userGroupIdsInCollection = collection.userGroups.map(
            (group) => group.uuid
          );
          const userGroupContainingMe = userGroups
            .filter((group) => userGroupIdsInCollection.includes(group.groupId))
            .find((group) =>
              (group?.users ?? []).find((user) => user.userId === login)
            );
          const hasAcceptedAsGroup = (userGroupContainingMe?.users ?? []).some(
            (user) => user.userId === login && user.status === "accepted"
          );
          return hasAcceptedAsUser || hasAcceptedAsGroup;
        });
        const { commands } =
          applicationModulesAccess.createClients().sharingCollections;
        commands.updateSharedCollections({
          collections: acceptedCollections,
        });
        commands.moveCollectionItemsToBusinessSpace();
      }
    }
  } catch (error) {
    const message = `[SharingSync] - update shared collections failed: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({
      error: augmentedError,
      code: ExceptionCriticality.WARNING,
    });
  }
  return sharingSync;
}
export async function updateSharingDataFromSync(
  sharingSync: SharingSync,
  storeService: StoreService
): Promise<SharingSync> {
  const { sharingData } = sharingSync;
  updateSharingData(storeService, sharingData);
  return sharingSync;
}
export async function putSharingSyncBackInStorage(
  sharingSync: SharingSync,
  storeService: StoreService,
  localStorageService: LocalStorageService
): Promise<SharingSync> {
  const { sharingSync: sharingSyncState } = storeService.getState().userSession;
  localStorageService.getInstance().storeSharingSync(sharingSyncState);
  return sharingSync;
}
export async function initSharingSyncFromStorage(
  sharingSync: SharingSync,
  storeService: StoreService,
  localStorageService: LocalStorageService
): Promise<SharingSync> {
  const userLocalDataService = localStorageService.getInstance();
  const hasLocalSharingSync = await userLocalDataService.doesSharingSyncExist();
  let storageSharingSync: SharingSyncState | null = null;
  const storeSharingSyncDefaults = () => {
    storageSharingSync = { pendingUserGroups: [], pendingItemGroups: [] };
    userLocalDataService.storeSharingSync(storageSharingSync);
  };
  if (!hasLocalSharingSync) {
    storeSharingSyncDefaults();
  }
  try {
    storageSharingSync = await userLocalDataService.getSharingSync();
  } catch (error) {
    storeSharingSyncDefaults();
  }
  const { pendingItemGroups, pendingUserGroups } = storageSharingSync;
  const action = setAllPendingAction(pendingItemGroups, pendingUserGroups);
  storeService.dispatch(action);
  return sharingSync;
}
export function getEmptyOperations(): Operations {
  return { collections: [], items: [], itemGroups: [], userGroups: [] };
}
export function getEmptyGetSharingParams(): GetSharingParams {
  return {
    collectionIds: [],
    itemIds: [],
    itemGroupIds: [],
    userGroupIds: [],
  };
}
export function getEmptySharingData(): SharingData {
  return { collections: [], items: [], itemGroups: [], userGroups: [] };
}
export function getEmptySharing2Summary(): Sharing2Summary {
  return { collections: [], items: [], itemGroups: [], userGroups: [] };
}
