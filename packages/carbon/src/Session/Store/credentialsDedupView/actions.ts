import {
  CREDENTIAL_DEDUP_VIEW_UPDATED,
  CredentialsDedupViewState,
  CredentialsDedupViewUpdatedAction,
} from "./types";
export const credentialsDedupViewUpdated = (
  credentialsDedupView: CredentialsDedupViewState
): CredentialsDedupViewUpdatedAction => ({
  type: CREDENTIAL_DEDUP_VIEW_UPDATED,
  credentialsDedupView,
});
