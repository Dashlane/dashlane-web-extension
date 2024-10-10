import { LiveQuery } from "Shared/Api";
import { AuthenticatorDetails } from "Authentication/Store/webAuthn/types";
export type WebAuthnAuthenticationLiveQueries = {
  liveWebAuthnAuthenticators: LiveQuery<void, AuthenticatorDetails[]>;
  liveWebAuthnAuthenticationOptedIn: LiveQuery<void, boolean>;
};
