import type { PersonalSettings } from "@dashlane/communication";
import type { Transaction } from "Libs/Backup/Transactions/types";
import { GenerateRsaKeyPair } from "User/Services/UserSessionService";
export const SAVE_ACCOUNT_SETTINGS = "SAVE_ACCOUNT_SETTINGS";
export const SAVE_ACCOUNT_KEYS = "SAVE_ACCOUNT_KEYS";
export const ACCOUNT_CREATION_STARTED = "ACCOUNT_CREATION_STARTED";
export interface SettingsState {
  personalSettings: PersonalSettings;
  promise: Promise<Transaction>;
}
export interface AccountKeyState {
  promise: Promise<GenerateRsaKeyPair>;
}
export function saveAccountSettings(settings: SettingsState) {
  return {
    type: SAVE_ACCOUNT_SETTINGS,
    settings,
  };
}
export function saveAccountKeys(accountKey: AccountKeyState) {
  return {
    type: SAVE_ACCOUNT_KEYS,
    accountKey,
  };
}
export function accountCreationStarted(params: { isSSO: boolean }) {
  return {
    type: ACCOUNT_CREATION_STARTED,
    isSSO: params.isSSO,
  };
}
