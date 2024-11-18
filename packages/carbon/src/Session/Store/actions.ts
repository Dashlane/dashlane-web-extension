import {
  BaseDataModelObject,
  DataModelObject,
  DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY,
  DataModelType,
  GeneratedPassword,
  PremiumStatus,
} from "@dashlane/communication";
import type { ClearTransaction } from "Libs/Backup/Transactions/types";
import { Action } from "Store";
import { LocalSettings } from "Session/Store/localSettings/types";
import { ChangeHistory } from "DataManagement/ChangeHistory";
import { PersonalData } from "Session/Store/personalData/types";
import {
  PersonalSettingsAction,
  PersonalSettingsActionType,
} from "Session/Store/personalSettings/actions";
export const OPEN_SESSION = "OPEN_SESSION";
export const CLOSE_SESSION = "CLOSE_SESSION";
export const CHANGES_FROM_TRANSACTIONS = "CHANGES_FROM_TRANSACTIONS";
export const ADD_PERSONAL_ITEM_FROM_TRANSACTION =
  "ADD_PERSONAL_ITEM_FROM_TRANSACTION";
export const REMOVE_PERSONAL_ITEM_FROM_TRANSACTION =
  "REMOVE_PERSONAL_ITEM_FROM_TRANSACTION";
export const LOCAL_SETTINGS_UPDATED = "LOAD_STORED_LOCAL_SETTINGS";
export const PREMIUM_STATUS_UPDATED = "PREMIUM_STATUS_UPDATED";
export const SAVE_GENERATED_PASSWORD = "SAVE_GENERATED_PASSWORD";
export const SAVE_PERSONAL_ITEM = "SAVE_PERSONAL_ITEM";
export const SAVE_PERSONAL_ITEMS = "SAVE_PERSONAL_ITEMS";
export interface SavePersonalDataItemAction extends Action {
  dataModelObject: BaseDataModelObject;
  dataType: keyof PersonalData;
  changeHistory?: ChangeHistory;
}
export function savePersonalDataItem(
  dataModelObject: BaseDataModelObject,
  kwType: DataModelType,
  changeHistory?: ChangeHistory
): SavePersonalDataItemAction {
  return {
    type: SAVE_PERSONAL_ITEM,
    dataType: DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[kwType],
    dataModelObject,
    changeHistory,
  };
}
export interface SavePersonalDataItemsAction extends Action {
  dataModelObjects: DataModelObject[];
  dataType: keyof PersonalData;
  changeHistory: ChangeHistory[];
}
export function savePersonalDataItems(
  dataModelObjects: DataModelObject[],
  kwType: DataModelType,
  changeHistory: ChangeHistory[]
): SavePersonalDataItemsAction {
  return {
    type: SAVE_PERSONAL_ITEMS,
    dataType: DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[kwType],
    dataModelObjects,
    changeHistory,
  };
}
export function saveGeneratedPassword(
  generatedPassword: GeneratedPassword
): Action {
  return {
    type: SAVE_GENERATED_PASSWORD,
    generatedPassword,
  };
}
export const openSession = (login: string): Action => ({
  type: OPEN_SESSION,
  login,
});
export const closeSession = (): Action => ({
  type: CLOSE_SESSION,
});
export interface LocalSettingsUpdatedAction extends Action {
  data: LocalSettings;
}
export const localSettingsUpdated = (localSettings: LocalSettings): Action => ({
  type: LOCAL_SETTINGS_UPDATED,
  data: Object.assign({}, localSettings),
});
export interface PremiumStatusUpdatedAction extends Action {
  premiumStatus: PremiumStatus;
}
export const premiumStatusUpdated = (
  premiumStatus: PremiumStatus
): PremiumStatusUpdatedAction => ({
  type: PREMIUM_STATUS_UPDATED,
  premiumStatus,
});
type PersonalDataItemAction = Action & {
  type:
    | typeof REMOVE_PERSONAL_ITEM_FROM_TRANSACTION
    | typeof ADD_PERSONAL_ITEM_FROM_TRANSACTION;
  itemId: string;
  content: BaseDataModelObject | null;
};
export type TransactionsAction = Action & {
  type: typeof CHANGES_FROM_TRANSACTIONS;
  actions: (PersonalDataItemAction | PersonalSettingsAction)[];
};
export const applyTransactions = (
  transactions: ClearTransaction[]
): TransactionsAction => {
  const actions = transactions.map((transaction) => {
    let actionType: TransactionsAction["actions"][number]["type"];
    if (transaction.type === "SETTINGS") {
      actionType = PersonalSettingsActionType.EditFromTransaction;
    } else {
      actionType =
        transaction.action === "BACKUP_REMOVE"
          ? REMOVE_PERSONAL_ITEM_FROM_TRANSACTION
          : ADD_PERSONAL_ITEM_FROM_TRANSACTION;
    }
    if (transaction.action === "BACKUP_EDIT" && transaction.content) {
      transaction.content["LastBackupTime"] = Math.floor(
        transaction.backupDate / 1000
      );
    }
    return {
      type: actionType,
      itemId: transaction.identifier,
      content: transaction.content,
    };
  });
  return {
    type: CHANGES_FROM_TRANSACTIONS,
    actions,
  };
};
