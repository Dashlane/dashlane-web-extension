import { Query } from "Shared/Api";
import { AuthenticatorDetails } from "Authentication/Store/webAuthn/types";
export type WebAuthnAuthenticationQueries = {
  getWebAuthnAuthenticators: Query<void, AuthenticatorDetails[]>;
  getWebAuthnAuthenticationOptedIn: Query<void, boolean>;
};
