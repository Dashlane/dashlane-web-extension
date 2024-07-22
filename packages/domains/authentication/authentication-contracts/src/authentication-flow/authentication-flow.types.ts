export type AuthenticationFlowViewStep =
  | "StartingStep"
  | "EmailStep"
  | "MasterPasswordStep"
  | "EmailTokenStep"
  | "DashlaneAuthenticatorStep"
  | "TwoFactorAuthenticationOtpStep"
  | "WebAuthnStep"
  | "SSORedirectionToIdpStep"
  | "DeviceToDeviceAuthenticationStep";
export interface AuthenticationFlowBaseView {
  readonly error?: string;
  readonly isLoading?: boolean;
  readonly localAccounts: LocalAccount[];
}
export interface AuthenticationFlowStartingView
  extends AuthenticationFlowBaseView {
  readonly step: "StartingStep";
}
export type RememberMeType = "autologin" | "webauthn" | "sso" | "disabled";
export interface LocalAccount {
  readonly login: string;
  readonly hasLoginOtp: boolean;
  readonly isLastSuccessfulLogin: boolean;
  readonly rememberMeType?: RememberMeType;
  readonly shouldAskMasterPassword?: boolean;
}
export interface UserConsent {
  consentType: "emailsOffersAndTips" | "privacyPolicyAndToS";
  status: boolean;
}
export enum SsoMigrationServerMethod {
  SSO = "sso",
  MP = "master_password",
}
export type AdminPermissionLevel =
  | "FULL"
  | "BILLING"
  | "GROUP_CREATE"
  | "GROUP_DELETE"
  | "GROUP_EDIT"
  | "GROUP_READ";
export interface AuthenticationFlowEmailView
  extends AuthenticationFlowBaseView {
  readonly step: "EmailStep";
  readonly loginEmail?: string;
}
export enum DeviceToDeviceAuthenticationFlowStep {
  WaitingForTransferRequest = "WaitingForTransferRequest",
  DisplayInstructions = "DisplayInstructions",
  LoadingPassphrase = "LoadingPassphrase",
  DisplayPassphrase = "DisplayPassphrase",
  LoadingAccount = "LoadingAccount",
  Error = "Error",
  DeviceRegistered = "DeviceRegistered",
}
export enum DeviceToDeviceAuthenticationErrors {
  GENERIC_ERROR = "GENERIC_ERROR",
  TIMEOUT = "TIMEOUT",
  REQUEST_REJECTED = "REQUEST_REJECTED",
  ACCOUNT_ERROR = "ACCOUNT_ERROR",
  RATE_LIMIT = "RATE_LIMIT",
}
export interface AuthenticationFlowDeviceToDeviceAuthenticationView
  extends AuthenticationFlowBaseView {
  readonly step: "DeviceToDeviceAuthenticationStep";
  readonly deviceToDeviceStep: DeviceToDeviceAuthenticationFlowStep;
  readonly passphrase?: string[];
  readonly loginEmail?: string;
}
export const isDeviceToDeviceAuthenticationError = (
  error: string
): error is DeviceToDeviceAuthenticationErrors => {
  return Object.values(DeviceToDeviceAuthenticationErrors).includes(
    error as DeviceToDeviceAuthenticationErrors
  );
};
export interface AuthenticationFlowEmailTokenView
  extends AuthenticationFlowBaseView {
  readonly step: "EmailTokenStep";
  readonly loginEmail?: string;
  readonly emailToken?: string;
  readonly isDashlaneAuthenticatorAvailable?: boolean;
}
export type AuthenticationFlowTwoFactorAuthenticationOtpType =
  | "totp"
  | "backupCode";
export type AuthenticationFlowOtpVerificationMode = "otp1" | "otp2";
export interface AuthenticationFlowTwoFactorAuthenticationOtpView
  extends AuthenticationFlowBaseView {
  readonly step: "TwoFactorAuthenticationOtpStep";
  readonly loginEmail?: string;
  readonly twoFactorAuthenticationOtpValue?: string;
  readonly twoFactorAuthenticationOtpType?: AuthenticationFlowTwoFactorAuthenticationOtpType;
}
export enum SSOMigrationType {
  MP_TO_SSO,
  MP_TO_SSO_WITH_INFO,
  SSO_TO_MP,
}
export interface AuthenticationFlowPasswordView
  extends AuthenticationFlowBaseView {
  readonly step: "MasterPasswordStep";
  readonly loginEmail: string;
  readonly isAccountRecoveryAvailable: boolean;
  readonly serviceProviderRedirectUrl?: string;
  readonly isNitroProvider: boolean;
  readonly isDashlaneAuthenticatorAvailable?: boolean;
  readonly migration?: SSOMigrationType;
  readonly isAuthenticationDone?: boolean;
}
export interface AuthenticationFlowDashlaneAuthenticatorView
  extends AuthenticationFlowBaseView {
  readonly step: "DashlaneAuthenticatorStep";
}
export interface AuthenticationFlowPinCodeView
  extends AuthenticationFlowBaseView {
  readonly loginEmail: string;
  readonly step: "PinCodeStep";
}
export interface AuthenticationFlowWebAuthnView
  extends AuthenticationFlowBaseView {
  readonly loginEmail: string;
  readonly step: "WebAuthnStep";
}
export interface AuthenticationFlowMachineSSORedirectionToIdpView
  extends AuthenticationFlowBaseView {
  readonly step: "SSORedirectionToIdpStep";
  readonly serviceProviderRedirectUrl: string;
  readonly isNitroProvider: boolean;
  readonly rememberMeForSSOPreference?: boolean;
  readonly loginEmail?: string;
}
export type AuthenticationFlowView =
  | AuthenticationFlowStartingView
  | AuthenticationFlowEmailView
  | AuthenticationFlowDeviceToDeviceAuthenticationView
  | AuthenticationFlowEmailTokenView
  | AuthenticationFlowPinCodeView
  | AuthenticationFlowMachineSSORedirectionToIdpView
  | AuthenticationFlowTwoFactorAuthenticationOtpView
  | AuthenticationFlowPasswordView
  | AuthenticationFlowDashlaneAuthenticatorView
  | AuthenticationFlowWebAuthnView
  | undefined;
export interface ChangeAccountEmailCommandRequest {
  readonly login?: string;
}
export interface SendAccountEmailCommandRequest {
  readonly login: string;
}
export interface SubmitEmailTokenCommandRequest {
  readonly emailToken: string;
  readonly deviceName: string;
}
export interface SubmitPinCodeCommandRequest {
  readonly pinCode: string;
}
export interface SubmitTotpCommandRequest {
  readonly twoFactorAuthenticationOtpValue: string;
}
export interface SubmitBackupCodeCommandRequest {
  readonly twoFactorAuthenticationOtpValue: string;
}
export interface ChangeTwoFactorAuthenticationOtpTypeCommandRequest {
  readonly twoFactorAuthenticationOtpType: AuthenticationFlowTwoFactorAuthenticationOtpType;
}
export interface SendMasterPasswordCommandRequest {
  readonly masterPassword: string;
  readonly rememberMe: boolean;
}
export interface WebAuthnAuthenticationFailCommandRequest {
  readonly webAuthnError: string;
}
export interface LoginViaSSORequest {
  readonly consents?: UserConsent[];
  readonly anonymousUserId?: string;
  readonly deviceName: string;
  readonly exist: boolean;
  readonly ssoServiceProviderKey: string;
  readonly login: string;
  readonly ssoToken: string;
  readonly currentAuths: SsoMigrationServerMethod;
  readonly expectedAuths: SsoMigrationServerMethod;
  readonly inStore: boolean;
  readonly requiredPermissions: AdminPermissionLevel | null;
  readonly shouldRememberMeForSSO?: boolean;
}
export interface GetSsoUserSettingsQueryResult {
  rememberMeForSSOPreference: boolean;
}
export interface GetSsoProviderInfoQueryResult {
  readonly serviceProviderUrl?: string;
  readonly isNitroProvider?: boolean;
  readonly migrationType?: SSOMigrationType;
}
export interface InitiateLoginWithSSOCommandRequest {
  readonly login: string;
  readonly rememberMeForSSOPreference: boolean;
}
export interface InitiateAutologinWithSSOCommandRequest {
  readonly login: string;
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
  challenges: U2FChallenge[];
}
export interface U2FChallenge {
  challenge: string;
  version: string;
  appId: string;
  keyHandle: string;
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
export type MasterPasswordType = "masterPassword" | "invisibleMasterPassword";
