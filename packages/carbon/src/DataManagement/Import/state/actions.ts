import { ImportPersonalDataState } from "@dashlane/communication";
export const NOTIFY_NEW_PERSONAL_DATA_STATE = "NOTIFY_NEW_PERSONAL_DATA_STATE";
export interface NotifyNewImportPersonalDataStateAction {
  type: typeof NOTIFY_NEW_PERSONAL_DATA_STATE;
  newState: ImportPersonalDataState;
}
export const notifyNewImportPersonalDataStateAction = (
  newState: ImportPersonalDataState
): NotifyNewImportPersonalDataStateAction => ({
  type: NOTIFY_NEW_PERSONAL_DATA_STATE,
  newState,
});
