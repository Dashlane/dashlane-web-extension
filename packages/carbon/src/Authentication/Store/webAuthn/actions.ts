import { AuthenticatorDetails } from "Authentication/Store/webAuthn/types";
import { Action } from "Store";
export const WEBAUTHN_USERID_UPDATED = "WEBAUTHN_USERID_UPDATED";
export const WEBAUTHN_AUTHENTICATOR_ADDED = "WEBAUTHN_AUTHENTICATOR_ADDED";
export const WEBAUTHN_AUTHENTICATOR_REMOVED = "WEBAUTHN_AUTHENTICATOR_REMOVED";
export const WEBAUTHN_AUTHENTICATORS_LIST_UPDATED =
  "WEBAUTHN_AUTHENTICATORS_LIST_UPDATED";
export const WEBAUTHN_AVAILABLE_AUTHENTICATORS_LIST_UPDATED =
  "WEBAUTHN_AVAILABLE_AUTHENTICATORS_LIST_UPDATED";
export const webAuthnUserIdUpdated = (
  webAuthnUserId: string
): WebAuthnUserIdUpdatedAction => ({
  type: WEBAUTHN_USERID_UPDATED,
  webAuthnUserId,
});
export const webAuthnAuthenticatorAdded = (
  authenticator: AuthenticatorDetails
): WebAuthnAuthenticatorAddedAction => ({
  type: WEBAUTHN_AUTHENTICATOR_ADDED,
  authenticator,
});
export const webAuthnAuthenticatorRemoved = (
  credentialId: string
): WebAuthnAuthenticatorRemovedAction => ({
  type: WEBAUTHN_AUTHENTICATOR_REMOVED,
  credentialId,
});
export const webAuthnAuthenticatorsListUpdated = (
  authenticatorsList: AuthenticatorDetails[]
): WebAuthnAuthenticatorsListUpdatedAction => ({
  type: WEBAUTHN_AUTHENTICATORS_LIST_UPDATED,
  authenticatorsList,
});
export const webAuthnAvailableAuthenticatorsListUpdated = (
  availableAuthenticatorsList: AuthenticatorDetails[]
): WebAuthnAvailableAuthenticatorsListUpdatedAction => ({
  type: WEBAUTHN_AVAILABLE_AUTHENTICATORS_LIST_UPDATED,
  availableAuthenticatorsList,
});
export interface WebAuthnUserIdUpdatedAction extends Action {
  type: typeof WEBAUTHN_USERID_UPDATED;
  webAuthnUserId: string;
}
export interface WebAuthnAuthenticatorAddedAction extends Action {
  type: typeof WEBAUTHN_AUTHENTICATOR_ADDED;
  authenticator: AuthenticatorDetails;
}
export interface WebAuthnAuthenticatorRemovedAction extends Action {
  type: typeof WEBAUTHN_AUTHENTICATOR_REMOVED;
  credentialId: string;
}
export interface WebAuthnAuthenticatorsListUpdatedAction extends Action {
  type: typeof WEBAUTHN_AUTHENTICATORS_LIST_UPDATED;
  authenticatorsList: AuthenticatorDetails[];
}
export interface WebAuthnAvailableAuthenticatorsListUpdatedAction
  extends Action {
  type: typeof WEBAUTHN_AVAILABLE_AUTHENTICATORS_LIST_UPDATED;
  availableAuthenticatorsList: AuthenticatorDetails[];
}
export type WebAuthnAuthenticationAction =
  | WebAuthnAuthenticatorAddedAction
  | WebAuthnAuthenticatorRemovedAction
  | WebAuthnAuthenticatorsListUpdatedAction
  | WebAuthnAvailableAuthenticatorsListUpdatedAction
  | WebAuthnUserIdUpdatedAction;
