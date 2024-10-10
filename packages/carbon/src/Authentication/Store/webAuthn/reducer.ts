import {
  AuthenticatorDetails,
  WebAuthnAuthenticationState,
} from "Authentication/Store/webAuthn/types";
import {
  WEBAUTHN_AUTHENTICATOR_ADDED,
  WEBAUTHN_AUTHENTICATOR_REMOVED,
  WEBAUTHN_AUTHENTICATORS_LIST_UPDATED,
  WEBAUTHN_AVAILABLE_AUTHENTICATORS_LIST_UPDATED,
  WEBAUTHN_USERID_UPDATED,
  WebAuthnAuthenticationAction,
} from "Authentication/Store/webAuthn/actions";
export const getEmptyWebAuthnAuthentication =
  (): WebAuthnAuthenticationState => ({
    webAuthnUserId: null,
    authenticators: [],
  });
export const webAuthnAuthenticationReducer = (
  state = getEmptyWebAuthnAuthentication(),
  action: WebAuthnAuthenticationAction
): WebAuthnAuthenticationState => {
  switch (action.type) {
    case WEBAUTHN_USERID_UPDATED: {
      return {
        ...state,
        webAuthnUserId: action.webAuthnUserId,
      };
    }
    case WEBAUTHN_AUTHENTICATOR_ADDED: {
      return {
        ...state,
        authenticators: [...state.authenticators, action.authenticator],
      };
    }
    case WEBAUTHN_AUTHENTICATOR_REMOVED: {
      const newAuthenticatorsList: AuthenticatorDetails[] =
        state.authenticators.filter(
          (authenticator) => authenticator.credentialId !== action.credentialId
        );
      return {
        ...state,
        authenticators: newAuthenticatorsList,
      };
    }
    case WEBAUTHN_AUTHENTICATORS_LIST_UPDATED: {
      return {
        ...state,
        authenticators: action.authenticatorsList,
      };
    }
    case WEBAUTHN_AVAILABLE_AUTHENTICATORS_LIST_UPDATED: {
      const availableCredentialIds = action.availableAuthenticatorsList.map(
        (authenticator) => authenticator.credentialId
      );
      const newAuthenticatorsList: AuthenticatorDetails[] =
        state.authenticators.map((authenticator) =>
          availableCredentialIds.includes(authenticator.credentialId)
            ? { ...authenticator, canOpenSession: true }
            : { ...authenticator, canOpenSession: false }
        );
      return {
        ...state,
        authenticators: newAuthenticatorsList,
      };
    }
    default:
      return state;
  }
};
