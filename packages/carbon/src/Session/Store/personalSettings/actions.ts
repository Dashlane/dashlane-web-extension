import { BaseDataModelObject, PersonalSettings } from "@dashlane/communication";
export const TOGGLE_DASHLANE_ON_PAGE = "TOGGLE_DASHLANE_ON_PAGE";
export const TOGGLE_DASHLANE_ON_SITE = "TOGGLE_DASHLANE_ON_SITE";
export enum PersonalSettingsActionType {
  Edit = "EDIT_PERSONAL_SETTINGS",
  EditFromTransaction = "EDIT_PERSONAL_SETTINGS_FROM_TRANSACTION",
  LoadFromStorage = "LOAD_PERSONAL_SETTINGS_FROM_STORAGE",
}
export interface LoadPersonalSettingsFromStorageAction {
  type: PersonalSettingsActionType.LoadFromStorage;
  data: PersonalSettings;
}
export interface EditPersonalSettingsAction {
  type: PersonalSettingsActionType.Edit;
  content: Partial<PersonalSettings>;
}
export interface EditPersonalSettingsFromTransactionAction {
  type: PersonalSettingsActionType.EditFromTransaction;
  content: BaseDataModelObject;
}
export type PersonalSettingsAction =
  | LoadPersonalSettingsFromStorageAction
  | EditPersonalSettingsAction
  | EditPersonalSettingsFromTransactionAction;
export const loadStoredPersonalSettings = (
  personalSettings: PersonalSettings
): LoadPersonalSettingsFromStorageAction => ({
  type: PersonalSettingsActionType.LoadFromStorage,
  data: Object.assign({}, personalSettings),
});
export const editPersonalSettings = (
  personnalSettingsChunk: Partial<PersonalSettings>
): EditPersonalSettingsAction => ({
  type: PersonalSettingsActionType.Edit,
  content: Object.assign({}, personnalSettingsChunk),
});
