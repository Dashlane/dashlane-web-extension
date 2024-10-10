import {
  AssertionCredentialJSONCustom,
  AttestationCredentialJSONCustom,
  PublicKeyCredentialRequestOptionsJSON,
} from "@dashlane/authentication-contracts";
import { AuthenticatorDetails } from "Authentication/Store/webAuthn/types";
export interface AttestationAuthenticator {
  authenticationType: "webauthn.create";
  name: string;
  isRoaming: boolean;
  credential: AttestationCredentialJSONCustom;
}
export interface AssertionAuthenticator {
  authenticationType: "webauthn.get";
  credential: AssertionCredentialJSONCustom;
}
export enum StartWebAuthnAuthenticationError {
  CANNOT_REFRESH_WEBAUTHN_AUTHENTICATORS = "CANNOT_REFRESH_WEBAUTHN_AUTHENTICATORS",
  CANNOT_FETCH_WEBAUTHN_CHALLENGE = "CANNOT_FETCH_WEBAUTHN_CHALLENGE",
}
export interface StartWebAuthnAuthenticationSuccess {
  success: true;
  response: {
    publicKeyOptions: PublicKeyCredentialRequestOptionsJSON;
    authenticatorsInfo: AuthenticatorDetails[];
  };
}
export interface StartWebAuthnAuthenticationFailure {
  success: false;
  error: {
    code: StartWebAuthnAuthenticationError;
  };
}
export type StartWebAuthnAuthenticationResult =
  | StartWebAuthnAuthenticationSuccess
  | StartWebAuthnAuthenticationFailure;
