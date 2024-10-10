import { LocalAccountInfo } from "@dashlane/communication";
import { Action } from "Store";
export enum ReactivationStatus {
  DISABLED = "DISABLED",
  CLASSIC = "CLASSIC",
  WEBAUTHN = "WEBAUTHN",
}
export interface LocalAccountsAuthenticationState {
  accountsList: LocalAccountInfo[];
  reactivationStatus: ReactivationStatus;
  accountsListInitialized: boolean;
}
export const LOCAL_ACCOUNTS_LIST_UPDATED = "LOCAL_ACCOUNTS_LIST_UPDATED";
export interface LocalAccountsListUpdatedAction extends Action {
  type: typeof LOCAL_ACCOUNTS_LIST_UPDATED;
  localAccounts: LocalAccountInfo[];
}
export const REACTIVATION_STATUS_UPDATED = "REACTIVATION_STATUS_UPDATED";
export interface ReactivationStatusUpdatedAction extends Action {
  type: typeof REACTIVATION_STATUS_UPDATED;
  reactivationStatus: ReactivationStatus;
}
export type LocalAccountsAuthenticationActionTypes =
  | LocalAccountsListUpdatedAction
  | ReactivationStatusUpdatedAction;
