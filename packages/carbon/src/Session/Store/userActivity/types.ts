import { Action } from "redux";
export interface UserActivityState {
  lastSentAt: number | undefined;
}
export const LAST_SENT_AT_UPDATED = "LAST_SENT_AT_UPDATED";
export interface LastSentAtUpdatedAction extends Action {
  type: typeof LAST_SENT_AT_UPDATED;
  lastSentAt: number | undefined;
}
export type UserActivityAction = LastSentAtUpdatedAction;
