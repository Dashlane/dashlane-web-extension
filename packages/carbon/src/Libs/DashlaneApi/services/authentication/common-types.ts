export type SSOMigrationTypes =
  | "sso_member_to_admin"
  | "mp_user_to_sso_member"
  | "sso_member_to_mp_user";
export interface RemoteKey {
  uuid: string;
  key: string;
  type: "sso" | "master_password";
}
export interface SsoRemoteKey extends RemoteKey {
  type: "sso";
}
export interface CompleteDeviceRegistrationSuccess {
  deviceAccessKey: string;
  deviceSecretKey: string;
  serverKey?: string;
  settings: {
    backupDate: number;
    identifier: string;
    time: number;
    content: string;
    type: "SETTINGS";
    action: "BACKUP_EDIT";
  };
  sharingKeys?: {
    publicKey: string;
    privateKey: string;
  };
  numberOfDevices: number;
  hasDesktopDevices: boolean;
  publicUserId: string;
  remoteKeys?: RemoteKey[];
  ssoServerKey?: string;
  deviceAnalyticsId: string;
  userAnalyticsId: string;
}
export interface EmailTokenVerification {
  type: "email_token";
}
export interface TOTPVerification {
  type: "totp";
}
export interface DuoPushVerification {
  type: "duo_push";
}
export interface DashlaneAuthenticatorVerification {
  type: "dashlane_authenticator";
}
export interface U2FVerification {
  type: "u2f";
  challenges?: U2FChallenge[];
}
export interface SSOLoginVerification {
  type: "sso";
  ssoInfo: {
    serviceProviderUrl: string;
    migration?:
      | "sso_member_to_admin"
      | "mp_user_to_sso_member"
      | "sso_member_to_mp_user";
    isNitroProvider?: boolean;
  };
}
export type SupportedAuthenticationMethod =
  | "email_token"
  | "totp"
  | "duo_push"
  | "dashlane_authenticator"
  | "u2f";
export type VerificationMethod =
  | EmailTokenVerification
  | TOTPVerification
  | DuoPushVerification
  | U2FVerification
  | SSOLoginVerification
  | DashlaneAuthenticatorVerification;
export interface U2FChallenge {
  challenge: string;
  version: string;
  appId: string;
  keyHandle: string;
}
export interface CompleteLoginSuccess {
  serverKey: string;
}
export interface Profile {
  login: string;
  deviceAccessKey: string;
}
export interface UserSSOInfoResponse {
  serviceProviderUrl: string;
  migration?: SSOMigrationTypes;
  isNitroProvider?: boolean;
}
export interface WebAuthnAuthenticator {
  name: string;
  credentialId: string;
  creationDateUnix: number;
  isRoaming: boolean;
}
interface WebAuthnCredential {
  id: string;
  rawId: string;
  type: string;
}
interface CreateWebAuthnCredential extends WebAuthnCredential {
  response: {
    attestationObject: string;
    clientDataJSON: string;
  };
}
interface GetWebAuthnCredential extends WebAuthnCredential {
  response: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
  };
}
export interface AuthenticatorUnsecure {
  authenticationType: string;
}
export interface CreateWebAuthnAuthenticator {
  authenticationType: "webauthn.create";
  name: string;
  isRoaming: boolean;
  credential: CreateWebAuthnCredential;
}
export interface GetWebAuthnAuthenticator {
  authenticationType: "webauthn.get";
  credential: GetWebAuthnCredential;
}
export const DeviceDeactivated = "device_deactivated" as const;
export const DeviceNotFound = "device_not_found" as const;
export const InvalidOTPAlreadyUsed = "invalid_otp_already_used" as const;
export const InvalidOTPBlocked = "invalid_otp_blocked" as const;
export const U2fBadRequest = "u2f_bad_request" as const;
export const UserNotFound = "user_not_found" as const;
export const SSOBlocked = "SSO_BLOCKED" as const;
export const TeamGenericError = "TEAM_GENERIC_ERROR" as const;
export const VerificationFailed = "verification_failed" as const;
export const VerificationMethodDisabled =
  "verification_method_disabled" as const;
export const FailedToContactAuthenticatorDevice =
  "FAILED_TO_CONTACT_AUTHENTICATOR_DEVICE" as const;
export const UserHasNoActiveAuthenticator =
  "USER_HAS_NO_ACTIVE_AUTHENTICATOR" as const;
export const TwofaEmailTokenNotEnabled =
  "TWOFA_EMAIL_TOKEN_NOT_ENABLED" as const;
export const InvalidAuthentication = "invalid_authentication" as const;
export const ChallengeNotFound = "CHALLENGE_NOT_FOUND" as const;
export const ChallengeExpired = "CHALLENGE_EXPIRED" as const;
export const ChallengeVerificationFailed =
  "CHALLENGE_VERIFICATION_FAILED" as const;
export const AttestationRejected = "ATTESTATION_REJECTED" as const;
export const AssertionRejected = "ASSERTION_REJECTED" as const;
export const AuthenticatorNotRegistered =
  "AUTHENTICATOR_NOT_REGISTERED" as const;
export const AuthenticationTypeNotSupported =
  "AUTHENTICATION_TYPE_NOT_SUPPORTED" as const;
export const AuthenticatorNotAvailableOnDevice =
  "AUTHENTICATOR_NOT_AVAILABLE_ON_DEVICE" as const;
export const SessionNotFound = "SESSION_NOT_FOUND" as const;
export const MismatchedSessionSecurity = "MISMATCHED_SESSION_SECURITY" as const;
export const ExistingSecureRemembermeSession =
  "EXISTING_SECURE_REMEMBERME_SESSION" as const;
