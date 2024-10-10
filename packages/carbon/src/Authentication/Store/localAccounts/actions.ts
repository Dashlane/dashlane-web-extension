import { LocalAccountInfo } from "@dashlane/communication";
import {
  LOCAL_ACCOUNTS_LIST_UPDATED,
  LocalAccountsListUpdatedAction,
  REACTIVATION_STATUS_UPDATED,
  ReactivationStatus,
  ReactivationStatusUpdatedAction,
} from "Authentication/Store/localAccounts/types";
export const localAccountsListUpdated = (
  localAccounts: LocalAccountInfo[]
): LocalAccountsListUpdatedAction => ({
  type: LOCAL_ACCOUNTS_LIST_UPDATED,
  localAccounts,
});
export const reactivationStatusUpdated = (
  reactivationStatus: ReactivationStatus
): ReactivationStatusUpdatedAction => ({
  type: REACTIVATION_STATUS_UPDATED,
  reactivationStatus,
});
