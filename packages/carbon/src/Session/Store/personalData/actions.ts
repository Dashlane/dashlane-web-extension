import type {
  BaseDataModelObject,
  BreachesUpdaterStatus,
  DataModelType,
  GeneratedPassword,
  NoteCategory,
  PaymentCard,
} from "@dashlane/communication";
import { Action } from "Store";
import { PersonalData } from "Session/Store/personalData/types";
import { ChangeHistory } from "DataManagement/ChangeHistory";
import { UploadChange } from "Libs/Backup/Upload/UploadChange";
import { ForceCategorizableKWType } from "DataManagement/SmartTeamSpaces/forced-categorization.domain-types";
import { BreachesUpdaterChanges } from "DataManagement/Breaches/AppServices/types";
export const LOAD_STORED_PERSONAL_DATA =
  "PERSONAL_DATA/LOAD_STORED_PERSONAL_DATA";
export const SAVE_GENERATED_PASSWORD = "PERSONAL_DATA/SAVE_GENERATED_PASSWORD";
export const SAVE_PERSONAL_ITEM = "PERSONAL_DATA/SAVE_PERSONAL_ITEM";
export const SAVE_PERSONAL_ITEMS = "PERSONAL_DATA/SAVE_PERSONAL_ITEMS";
export const SAVE_NOTE_CATEGORY = "SAVE_NOTE_CATEGORY";
export const SAVE_PAYMENT_CARD = "SAVE_PAYMENT_CARD";
export const UPDATE_LAST_BACKUP_TIME = "UPDATE_LAST_BACKUP_TIME";
export const BREACHES_UPDATED = "BREACHES_UPDATED";
export const STORE_CHANGES_TO_UPLOAD = "STORE_CHANGES_TO_UPLOAD";
export const TEAMSPACE_CONTENT_CONTROLLED = "TEAMSPACE_CONTENT_CONTROLLED";
export const UPDATE_BREACHES_UPDATER_STATUS = "UPDATE_BREACHES_UPDATER_STATUS";
export const SCHEDULE_CHANGES_FOR_SYNC = "SCHEDULE_CHANGES_FOR_SYNC";
export const CLEAR_UPLOADED_CHANGES = "CLEAR_UPLOADED_CHANGES";
export const UNSCHEDULE_REMAINING_CHANGES = "UNSCHEDULE_REMAINING_CHANGES";
export const DELETE_VAULT_MODULE_ITEM = "DELETE_VAULT_MODULE_ITEM";
export const DELETE_VAULT_MODULE_ITEMS_BULK = "DELETE_VAULT_MODULE_ITEMS_BULK";
export interface BreachesUpdatedAction extends Action {
  type: typeof BREACHES_UPDATED;
  changes: BreachesUpdaterChanges;
  revision: number;
  dataLeaksRefreshDate?: number;
}
export interface TeamSpaceContentControlAppliedAction {
  type: typeof TEAMSPACE_CONTENT_CONTROLLED;
  updates: BaseDataModelObject[];
  deletions: Record<ForceCategorizableKWType, string[]>;
  changeHistories: ChangeHistory[];
}
export interface ClearUploadedChangesAction {
  type: typeof CLEAR_UPLOADED_CHANGES;
  uploadedItemIds: string[];
}
export interface ScheduleChangesForSyncAction {
  type: typeof SCHEDULE_CHANGES_FOR_SYNC;
}
export interface UnscheduleRemainingChangesAction {
  type: typeof UNSCHEDULE_REMAINING_CHANGES;
}
export const loadStoredPersonalData = (personalData: PersonalData): Action => ({
  type: LOAD_STORED_PERSONAL_DATA,
  data: Object.assign({}, personalData),
});
export const scheduleChangesForSync = (): ScheduleChangesForSyncAction => ({
  type: SCHEDULE_CHANGES_FOR_SYNC,
});
export const clearUploadedChanges = (
  uploadedItemIds: string[]
): ClearUploadedChangesAction => ({
  type: CLEAR_UPLOADED_CHANGES,
  uploadedItemIds,
});
export const unscheduleRemainingChanges =
  (): UnscheduleRemainingChangesAction => ({
    type: UNSCHEDULE_REMAINING_CHANGES,
  });
export interface SaveNewCredentialActionCreator {
  (
    credential: Credential,
    changeHistory: ChangeHistory
  ): SaveNewCredentialAction;
}
export interface SaveNewCredentialAction extends Action {
  credential: Credential;
  changeHistory: ChangeHistory;
}
export function savePaymentCard(paymentCard: PaymentCard): Action {
  return {
    type: SAVE_PAYMENT_CARD,
    paymentCard,
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
export function saveNoteCategory(noteCategory: NoteCategory): Action {
  return {
    type: SAVE_NOTE_CATEGORY,
    noteCategory,
  };
}
export function deleteVaultModuleItem(payload: {
  id: string;
  kwType: DataModelType;
  changeHistory: ChangeHistory | null;
}) {
  return {
    type: DELETE_VAULT_MODULE_ITEM,
    payload,
  } as const satisfies Action;
}
export function deleteVaultModuleItemsBulk(payload: {
  kwType: DataModelType;
  items: Array<{
    id: string;
    changeHistory: ChangeHistory;
  }>;
}) {
  return {
    type: DELETE_VAULT_MODULE_ITEMS_BULK,
    payload,
  } as const satisfies Action;
}
export function removePersonalItem(
  kwType: DataModelType,
  itemId: string,
  changeHistory: ChangeHistory
): Action {
  return deleteVaultModuleItem({ kwType, id: itemId, changeHistory });
}
export function updateLastBackupTime(
  transactions: string[],
  backupTimeSec: number
): Action {
  return {
    type: UPDATE_LAST_BACKUP_TIME,
    transactions,
    backupTimeSec,
  };
}
export function breachesUpdated(
  changes: BreachesUpdaterChanges,
  revision: number,
  dataLeaksRefreshDate?: number
): BreachesUpdatedAction {
  return {
    type: BREACHES_UPDATED,
    changes,
    revision,
    dataLeaksRefreshDate,
  };
}
export function storeChangesToUpload(changesToUpload: UploadChange[]): Action {
  return {
    type: STORE_CHANGES_TO_UPLOAD,
    changesToUpload,
  };
}
export function teamSpaceContentControlApplied(
  updates: BaseDataModelObject[],
  deletions: Record<ForceCategorizableKWType, string[]>,
  changeHistories: ChangeHistory[]
): TeamSpaceContentControlAppliedAction {
  return {
    type: TEAMSPACE_CONTENT_CONTROLLED,
    updates,
    deletions,
    changeHistories,
  };
}
export const updateBreachesUpdaterStatus = (
  breachesUpdaterStatus: BreachesUpdaterStatus
) => ({
  type: UPDATE_BREACHES_UPDATER_STATUS,
  breachesUpdaterStatus,
});
