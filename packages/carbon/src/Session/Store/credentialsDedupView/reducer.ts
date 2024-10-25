import {
  CREDENTIAL_DEDUP_VIEW_UPDATED,
  CredentialsDedupViewAction,
  CredentialsDedupViewState,
} from "./types";
export function getDefaultCredentialsDedupView(): CredentialsDedupViewState {
  return { credentialsDedupView: false };
}
export function credentialsDedupViewReducer(
  state = getDefaultCredentialsDedupView(),
  action: CredentialsDedupViewAction
): CredentialsDedupViewState {
  switch (action.type) {
    case CREDENTIAL_DEDUP_VIEW_UPDATED:
      return {
        ...state,
        ...action.credentialsDedupView,
      };
    default:
      return state;
  }
}
