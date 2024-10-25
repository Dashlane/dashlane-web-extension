import { Action } from "redux";
export interface VaultReportState {
  lastSentAt: number | undefined;
}
export const LAST_SENT_AT_UPDATED = "LAST_SENT_AT_UPDATED";
export interface LastSentAtUpdatedAction extends Action {
  type: typeof LAST_SENT_AT_UPDATED;
  lastSentAt: number | undefined;
}
export type VaultReportAction = LastSentAtUpdatedAction;
