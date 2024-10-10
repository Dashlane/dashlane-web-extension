export interface AuthenticatorDetails {
  name: string;
  credentialId: string;
  creationDateUnix?: number;
  isRoaming: boolean;
  canOpenSession: boolean;
}
export interface WebAuthnAuthenticationState {
  webAuthnUserId: string;
  authenticators: AuthenticatorDetails[];
}
