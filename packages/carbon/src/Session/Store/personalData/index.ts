import { prop, reduce, uniqBy } from "ramda";
import {
  BaseDataModelObject,
  BreachesUpdaterStatus,
  Credential,
  DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY,
  DataModelType,
  GeneratedPassword,
  PaymentCard,
  PremiumStatusSpace,
  VersionedBreaches,
} from "@dashlane/communication";
import { PERSONAL_DATA_COLLECTIONS_KEYS } from "Session/Store/personalData/dataTypes";
import {
  fixPersistedPersonalData,
  fixPersonalDataItemFromExternalSource,
} from "Session/Store/personalData/normalizeData";
import {
  BREACHES_UPDATED,
  BreachesUpdatedAction,
  CLEAR_UPLOADED_CHANGES,
  ClearUploadedChangesAction,
  DELETE_VAULT_MODULE_ITEM,
  DELETE_VAULT_MODULE_ITEMS_BULK,
  LOAD_STORED_PERSONAL_DATA,
  SAVE_GENERATED_PASSWORD,
  SAVE_PAYMENT_CARD,
  SAVE_PERSONAL_ITEM,
  SAVE_PERSONAL_ITEMS,
  SCHEDULE_CHANGES_FOR_SYNC,
  ScheduleChangesForSyncAction,
  STORE_CHANGES_TO_UPLOAD,
  TEAMSPACE_CONTENT_CONTROLLED,
  TeamSpaceContentControlAppliedAction,
  UNSCHEDULE_REMAINING_CHANGES,
  UnscheduleRemainingChangesAction,
  UPDATE_BREACHES_UPDATER_STATUS,
  UPDATE_LAST_BACKUP_TIME,
} from "Session/Store/personalData/actions";
import { PersonalData } from "Session/Store/personalData/types";
import { UploadChange } from "Libs/Backup/Upload/UploadChange";
import { ChangeHistory } from "DataManagement/ChangeHistory/";
import { associateTeamSpaceId } from "DataManagement/Spaces/associate-team-space-id";
import { PersonalSettingsActionType } from "Session/Store/personalSettings/actions";
import {
  VersionedBreach,
  VersionedBreachesMetadata,
} from "DataManagement/Breaches/types";
import {
  createUploadChange,
  createUploadChangeForDeletion,
  createUploadChangeForItem,
} from "Libs/Backup/Upload/UploadChange/upload-change.factories";
import {
  filterOutUploadedChanges,
  markChangeAsReadyForNextSync,
  markChangeAsScheduled,
} from "Libs/Backup/Upload/UploadChange/upload-change.domain";
export const reducer = (
  state = getEmptyPersonalDataState(),
  action: any,
  spaces?: any
): PersonalData => {
  switch (action.type) {
    case LOAD_STORED_PERSONAL_DATA:
      return { ...state, ...fixPersistedPersonalData(action.data) };
    case DELETE_VAULT_MODULE_ITEM:
      return deleteVaultModulePersonalDataItem(state, action.payload);
    case DELETE_VAULT_MODULE_ITEMS_BULK:
      return deleteVaultModulePersonalDataItemsBulk(state, action.payload);
    case SAVE_PAYMENT_CARD:
      return savePaymentCard(state, action);
    case SAVE_PERSONAL_ITEM:
      return savePersonalDataItem(state, action, spaces);
    case SAVE_PERSONAL_ITEMS:
      return savePersonalDataItems(state, action, spaces);
    case SAVE_GENERATED_PASSWORD:
      return saveGeneratedPassword(state, action, spaces);
    case CLEAR_UPLOADED_CHANGES:
      return clearUploadedChanges(state, action);
    case SCHEDULE_CHANGES_FOR_SYNC:
      return scheduleChangesForSync(state, action);
    case UNSCHEDULE_REMAINING_CHANGES:
      return unscheduleRemainingChanges(state, action);
    case PersonalSettingsActionType.Edit:
      return savePersonalSettings(state);
    case UPDATE_LAST_BACKUP_TIME:
      return updateLastBackupTime(state, action);
    case BREACHES_UPDATED:
      return breachesUpdated(state, action);
    case STORE_CHANGES_TO_UPLOAD:
      return saveChangesToUpload(state, action);
    case TEAMSPACE_CONTENT_CONTROLLED:
      return teamSpaceContentControlApplied(state, action);
    case UPDATE_BREACHES_UPDATER_STATUS:
      return {
        ...state,
        breachesUpdaterStatus: action.breachesUpdaterStatus,
      };
    default:
      return state;
  }
};
export function getEmptyPersonalDataState(): PersonalData {
  return {
    addresses: [],
    bankAccounts: [],
    changesToUpload: [],
    changeHistories: [],
    collections: [],
    companies: [],
    credentialCategories: [],
    credentials: [],
    driverLicenses: [],
    emails: [],
    fiscalIds: [],
    generatedPasswords: [],
    idCards: [],
    identities: [],
    notes: [],
    passkeys: [],
    passports: [],
    paymentCards: [],
    paypalAccounts: [],
    personalWebsites: [],
    phones: [],
    secrets: [],
    securityBreaches: [],
    securityBreachesMetadata: getEmptyBreachesMetadata(),
    socialSecurityIds: [],
    breachesUpdaterStatus: BreachesUpdaterStatus.UNKNOWN,
    secureFileInfo: [],
  };
}
const isUnsupportedTransaction = (
  itemId: string,
  content: BaseDataModelObject
) =>
  !itemId ||
  !content ||
  !DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY.hasOwnProperty(content.kwType);
export function addPersonalItemFromTransaction(
  state: PersonalData,
  action: {
    itemId: string;
    content: BaseDataModelObject | null;
  }
): PersonalData {
  if (isUnsupportedTransaction(action.itemId, action.content)) {
    return state;
  }
  const keyInState =
    DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[action.content.kwType];
  const itemToAdd = fixPersonalDataItemFromExternalSource(
    action.content,
    action.itemId
  );
  return {
    ...state,
    [keyInState]: getUpdatedDataList(state[keyInState], itemToAdd),
  };
}
export function removePersonalItemFromTransaction(
  state: PersonalData,
  action: {
    itemId: string;
    content: BaseDataModelObject | null;
  }
): PersonalData {
  if (!action.itemId) {
    return state;
  }
  if (action.content) {
    return getStateWithoutItems(state, [action.itemId], action.content.kwType);
  } else {
    return getStateWithoutItems(state, [action.itemId]);
  }
}
const scheduleChangesForSync = (
  state: PersonalData,
  _action: ScheduleChangesForSyncAction
): PersonalData => ({
  ...state,
  changesToUpload: state.changesToUpload.map(markChangeAsScheduled),
});
const clearUploadedChanges = (
  state: PersonalData,
  action: ClearUploadedChangesAction
): PersonalData => ({
  ...state,
  changesToUpload: filterOutUploadedChanges(
    state.changesToUpload,
    action.uploadedItemIds
  ),
});
const unscheduleRemainingChanges = (
  state: PersonalData,
  _action: UnscheduleRemainingChangesAction
): PersonalData => ({
  ...state,
  changesToUpload: state.changesToUpload.map(markChangeAsReadyForNextSync),
});
export function savePersonalSettings(state: PersonalData): PersonalData {
  if (
    state.changesToUpload.find((item) => item.kwType === "KWSettingsManagerApp")
  ) {
    return state;
  }
  const uploadChange = createUploadChange({
    itemId: "SETTINGS_userId",
    kwType: "KWSettingsManagerApp",
    action: "EDIT",
  });
  return {
    ...state,
    changesToUpload: [...state.changesToUpload, uploadChange],
  };
}
export function teamSpaceContentControlApplied(
  state: PersonalData,
  action: TeamSpaceContentControlAppliedAction
): PersonalData {
  const { updates, deletions, changeHistories } = action;
  const stateAfterUpdates = updates.reduce((acc, dataModelObject) => {
    const { kwType } = dataModelObject;
    const dataType = DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[kwType];
    if (!dataType) {
      return acc;
    }
    return {
      ...acc,
      [dataType]: getUpdatedDataList(acc[dataType] || [], dataModelObject),
    };
  }, state);
  const updatesIdsToUpload = updates.map(createUploadChangeForItem);
  const stateAfterDeletions = Object.keys(deletions).reduce(
    (acc: PersonalData, kwType: DataModelType) =>
      getStateWithoutItems(acc, deletions[kwType], kwType),
    stateAfterUpdates
  );
  const deletionIdsToUpload = Object.keys(deletions).reduce(
    (acc, kwType: DataModelType) =>
      acc.concat(deletions[kwType].map(createUploadChangeForDeletion(kwType))),
    [] as UploadChange[]
  );
  const updatedChangeHistories = getUpdatedConcatedLists<ChangeHistory>(
    state.changeHistories,
    changeHistories
  );
  const changeHistoryIdsToUpload = changeHistories.map(
    createUploadChangeForItem
  );
  const allIdsToUpload = [
    ...updatesIdsToUpload,
    ...deletionIdsToUpload,
    ...changeHistoryIdsToUpload,
  ];
  const updatedChangesToUpload = getUpdatedChangesToUpload(
    state.changesToUpload,
    allIdsToUpload
  );
  return {
    ...stateAfterDeletions,
    changesToUpload: updatedChangesToUpload,
    changeHistories: updatedChangeHistories,
  };
}
export function deleteVaultModulePersonalDataItem(
  state: PersonalData,
  payload: {
    id: string;
    kwType: DataModelType;
    changeHistory: ChangeHistory | null;
  }
): PersonalData {
  const { changeHistory, kwType, id } = payload;
  const stateWithoutItem = getStateWithoutItems(state, [id], kwType);
  const itemUploadChange = createUploadChangeForDeletion(kwType)(id);
  const historyUploadChanges = changeHistory
    ? [createUploadChangeForItem(changeHistory)]
    : [];
  const uploadChanges = historyUploadChanges.length
    ? [itemUploadChange, ...historyUploadChanges]
    : itemUploadChange;
  const updatedChangeHistoriesList = changeHistory
    ? getUpdatedDataList<ChangeHistory>(state.changeHistories, changeHistory)
    : state.changeHistories;
  const updatedChangesToUpload = getUpdatedChangesToUpload(
    stateWithoutItem.changesToUpload,
    uploadChanges
  );
  return {
    ...stateWithoutItem,
    changesToUpload: updatedChangesToUpload,
    changeHistories: updatedChangeHistoriesList,
  };
}
export function deleteVaultModulePersonalDataItemsBulk(
  state: PersonalData,
  payload: {
    kwType: DataModelType;
    items: Array<{
      id: string;
      changeHistory: ChangeHistory | null;
    }>;
  }
): PersonalData {
  const { kwType, items } = payload;
  const stateWithoutItems = getStateWithoutItems(
    state,
    items.map(({ id }) => id),
    kwType
  );
  const getUploadChangeForDeletion = createUploadChangeForDeletion(kwType);
  const changes = items.reduce(
    (acc, { id, changeHistory }) => {
      const itemDeletionUploadChange = getUploadChangeForDeletion(id);
      acc.changesToUpload.push(itemDeletionUploadChange);
      if (changeHistory) {
        const itemChangeHistoryUploadChange =
          createUploadChangeForItem(changeHistory);
        acc.changesToUpload.push(itemChangeHistoryUploadChange);
        const updatedChangeHistoriesList = getUpdatedDataList<ChangeHistory>(
          acc.changeHistories,
          changeHistory
        );
        acc.changeHistories.push(...updatedChangeHistoriesList);
      }
      return acc;
    },
    { changesToUpload: [], changeHistories: state.changeHistories }
  );
  const updatedChangesToUpload = getUpdatedChangesToUpload(
    stateWithoutItems.changesToUpload,
    changes.changesToUpload
  );
  return {
    ...stateWithoutItems,
    changesToUpload: updatedChangesToUpload,
    changeHistories: changes.changeHistories,
  };
}
export function savePaymentCard(
  state: PersonalData,
  {
    paymentCard,
  }: {
    paymentCard: PaymentCard;
  }
): PersonalData {
  return {
    ...state,
    changesToUpload: getUpdatedChangesToUpload(
      state.changesToUpload,
      createUploadChangeForItem(paymentCard)
    ),
    paymentCards: getUpdatedDataList<PaymentCard>(
      state.paymentCards,
      paymentCard
    ),
  };
}
export function savePersonalDataItem(
  state: PersonalData,
  {
    dataType,
    dataModelObject,
    changeHistory,
  }: {
    dataType: string;
    dataModelObject: BaseDataModelObject;
    changeHistory?: ChangeHistory;
  },
  options: {
    spaces: PremiumStatusSpace[];
  }
): PersonalData {
  const objectWithSpace = associateTeamSpaceId(
    dataModelObject,
    options.spaces,
    state.credentials
  );
  const updatedChangeHistoriesList = changeHistory
    ? {
        changeHistories: getUpdatedDataList<ChangeHistory>(
          state.changeHistories,
          changeHistory
        ),
      }
    : {};
  const historyUploadChanges = changeHistory
    ? [createUploadChangeForItem(changeHistory)]
    : [];
  const uploadChanges = [
    createUploadChangeForItem(dataModelObject),
    ...historyUploadChanges,
  ];
  return {
    ...state,
    changesToUpload: getUpdatedChangesToUpload(
      state.changesToUpload,
      uploadChanges
    ),
    [dataType]: getUpdatedDataList(state[dataType], objectWithSpace),
    ...updatedChangeHistoriesList,
  };
}
export function savePersonalDataItems(
  state: PersonalData,
  {
    dataType,
    dataModelObjects,
    changeHistory,
  }: {
    dataType: string;
    dataModelObjects: BaseDataModelObject[];
    changeHistory: ChangeHistory[];
  },
  options: {
    spaces: PremiumStatusSpace[];
  }
): PersonalData {
  const objectsWithSpace = dataModelObjects.map((dataModelObject) =>
    associateTeamSpaceId(dataModelObject, options.spaces, state.credentials)
  );
  const uploadChanges = [
    ...dataModelObjects.map(createUploadChangeForItem),
    ...changeHistory.map(createUploadChangeForItem),
  ];
  return {
    ...state,
    changesToUpload: getUpdatedChangesToUpload(
      state.changesToUpload,
      uploadChanges
    ),
    [dataType]: getUpdatedConcatedLists(state[dataType], objectsWithSpace),
    changeHistories: getUpdatedConcatedLists<ChangeHistory>(
      state.changeHistories,
      changeHistory
    ),
  };
}
export function saveGeneratedPassword(
  state: PersonalData,
  {
    generatedPassword,
  }: {
    generatedPassword: GeneratedPassword;
  },
  options: {
    spaces: PremiumStatusSpace[];
  }
): PersonalData {
  const generatedPasswordWithSpace = associateTeamSpaceId<GeneratedPassword>(
    generatedPassword,
    options.spaces,
    state.credentials
  );
  return {
    ...state,
    changesToUpload: getUpdatedChangesToUpload(
      state.changesToUpload,
      createUploadChangeForItem(generatedPassword)
    ),
    generatedPasswords: getUpdatedDataList<GeneratedPassword>(
      state.generatedPasswords,
      generatedPasswordWithSpace
    ),
  };
}
export function saveObjects(
  state: PersonalData,
  objects: BaseDataModelObject[]
): PersonalData {
  return reduce(
    (personalData: PersonalData, object: BaseDataModelObject) => {
      const type = DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[object.kwType];
      if (type) {
        personalData[type] = personalData[type].concat(object);
      }
      return personalData;
    },
    { ...state },
    objects
  );
}
export function updateLastBackupTime(
  state: PersonalData,
  {
    transactions,
    backupTimeSec,
  }: {
    transactions: string[];
    backupTimeSec: number;
  }
): PersonalData {
  return Object.keys(state).reduce((newState, key) => {
    if (Array.isArray(state[key])) {
      newState[key] = updateLastBackupTimeOfItemsInList(
        state[key],
        transactions,
        backupTimeSec
      );
    }
    return newState;
  }, state);
}
export function updateCredentials(
  state: PersonalData,
  credentials: Credential[]
): PersonalData {
  return credentials.reduce(
    (state, credential) => updateCredential(state, credential),
    state
  );
}
export function updateCredential(
  state: PersonalData,
  credential: Credential
): PersonalData {
  const { credentials } = state;
  const updatedCredentials = getUpdatedDataList<Credential>(
    credentials,
    credential
  );
  return { ...state, credentials: updatedCredentials };
}
export function breachesUpdated(
  state: PersonalData,
  action: BreachesUpdatedAction
): PersonalData {
  const {
    changes: { updates, deletions },
  } = action;
  const kwType = DataModelType.KWSecurityBreach;
  const stateAfterDeletions = getStateWithoutItems(state, deletions, kwType);
  const updatesIdsToUpload = updates.map(createUploadChangeForItem);
  const deletionsIdsToUpload = deletions.map(
    createUploadChangeForDeletion(kwType)
  );
  const changesToUpload = getUpdatedChangesToUpload(
    stateAfterDeletions.changesToUpload,
    [...updatesIdsToUpload, ...deletionsIdsToUpload]
  );
  const securityBreaches = getUpdatedConcatedLists<VersionedBreach>(
    stateAfterDeletions.securityBreaches,
    updates
  );
  const latestDataLeaksBreachesUpdate =
    action.dataLeaksRefreshDate !== undefined
      ? action.dataLeaksRefreshDate
      : stateAfterDeletions.securityBreachesMetadata
          .latestDataLeaksBreachesUpdate;
  return {
    ...stateAfterDeletions,
    securityBreaches,
    securityBreachesMetadata: {
      latestPublicBreachesRevision: action.revision,
      latestDataLeaksBreachesUpdate,
    },
    changesToUpload,
  };
}
export function saveChangesToUpload(
  state: PersonalData,
  {
    changesToUpload,
  }: {
    changesToUpload: UploadChange[];
  }
): PersonalData {
  return {
    ...state,
    changesToUpload: getUpdatedChangesToUpload(
      state.changesToUpload,
      changesToUpload
    ),
  };
}
function getUpdatedDataList<T extends BaseDataModelObject>(
  list: T[],
  newItem: T
): T[] {
  const filteredList = removeExistingItemInList<T>(list, newItem.Id);
  return filteredList.concat(newItem);
}
function getUpdatedConcatedLists<T extends BaseDataModelObject>(
  list: T[],
  newItems: T[]
): T[] {
  const filteredList = removeExistingItemsInList<T>(
    list,
    newItems.map((item) => item.Id)
  );
  return [...filteredList, ...newItems];
}
function getUpdatedChangesToUpload(
  changesToUpload: UploadChange[],
  newChangesToUpload: UploadChange | UploadChange[]
): UploadChange[] {
  newChangesToUpload = Array.isArray(newChangesToUpload)
    ? newChangesToUpload
    : [newChangesToUpload];
  const updatedList = newChangesToUpload.concat(changesToUpload || []);
  return uniqBy<UploadChange, string>(prop("itemId"), updatedList);
}
function removeExistingItemInList<T extends BaseDataModelObject>(
  list: T[],
  identifier: string
): T[] {
  return list.filter((item) => item.Id !== identifier);
}
function removeExistingItemsInList<T extends BaseDataModelObject>(
  list: T[],
  identifiers: string[]
): T[] {
  return list.filter((item) => !identifiers.includes(item.Id));
}
function updateLastBackupTimeOfItemsInList<T extends BaseDataModelObject>(
  list: T[],
  identifiers: string[],
  lastBackupTime: number
): T[] {
  const toreAdd = list
    .filter((item) => identifiers.includes(item.Id))
    .map((item) => {
      return Object.assign(item, { LastBackupTime: lastBackupTime });
    });
  return list.filter((item) => !identifiers.includes(item.Id)).concat(toreAdd);
}
function getStateWithoutItems(
  state: PersonalData,
  itemIds: string[],
  kwType?: DataModelType
): PersonalData {
  if (kwType && DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[kwType]) {
    const collectionStateKey = DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[kwType];
    const previousCollection = state[collectionStateKey];
    const nextCollection = removeExistingItemsInList(
      state[collectionStateKey],
      itemIds
    );
    if (previousCollection.length === nextCollection.length) {
      return state;
    }
    return {
      ...state,
      [collectionStateKey]: nextCollection,
    };
  }
  const partialNewState = PERSONAL_DATA_COLLECTIONS_KEYS.reduce(
    (acc, collectionStateKey) => {
      if (!(collectionStateKey in state)) {
        return acc;
      }
      const currentStateForKey: BaseDataModelObject[] =
        state[collectionStateKey];
      const updatedSlice = removeExistingItemsInList(
        currentStateForKey,
        itemIds
      );
      return {
        ...acc,
        [collectionStateKey]: updatedSlice,
      };
    },
    {} as PersonalData
  );
  if (Object.keys(partialNewState).length === 0) {
    return state;
  }
  return { ...state, ...partialNewState };
}
export const getLegacyEmptyBreaches = (): VersionedBreaches => ({
  revision: 0,
  breaches: [],
});
export const getEmptyBreachesMetadata = (): VersionedBreachesMetadata => ({
  latestPublicBreachesRevision: 0,
  latestDataLeaksBreachesUpdate: 0,
});
export const countPersonalDataItems = (personalData: PersonalData) =>
  Object.keys(DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY).reduce(
    (sum, kwType) => {
      return (
        sum +
        personalData[DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[kwType]].length
      );
    },
    0
  );
