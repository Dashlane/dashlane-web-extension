import { Action } from "redux";
export interface CredentialsDedupViewState {
  credentialsDedupView: boolean;
}
export const CREDENTIAL_DEDUP_VIEW_UPDATED = "CREDENTIAL_DEDUP_VIEW_UPDATED";
export interface CredentialsDedupViewUpdatedAction extends Action {
  type: typeof CREDENTIAL_DEDUP_VIEW_UPDATED;
  credentialsDedupView: CredentialsDedupViewState;
}
export type CredentialsDedupViewAction = CredentialsDedupViewUpdatedAction;
