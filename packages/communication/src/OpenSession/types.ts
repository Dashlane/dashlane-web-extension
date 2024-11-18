import type { ValuesType } from "@dashlane/framework-types";
import { Trigger } from "@dashlane/hermes";
import { AuthenticationCode } from "../Authentication";
export interface GetUki {
  uki: string;
}
export interface GetLoginStatus {
  loggedIn: boolean;
  login: string;
  needsSSOMigration?: boolean;
}
export enum PremiumStatusCode {
  NO_PREMIUM = 0,
  PREMIUM = 1,
  PREMIUM_CANCELLED = 2,
  OLD_ACCOUNT = 3,
  NEW_USER = 4,
  GRACE_PERIOD = 5,
}
export interface PremiumStatusBillingInfo {
  cardExpirationYear: number;
  cardExpirationMonth: number;
  cardLast4Digits: number;
  cardType: string;
}
export interface PreviousPremiumPlan {
  endDate?: number;
  planFeature?: PlanFeature;
  planId?: string;
  startDate?: number;
  statusCode?: PremiumStatusCode;
  planName?: string;
}
interface CapabilityOn {
  enabled: true;
  info?: any;
}
interface CapabilityOff {
  enabled: false;
  info?: {
    reason?: string;
  };
}
export type Capability = CapabilityOn | CapabilityOff;
export const CapabilityKeys = [
  "adminPolicies",
  "autofillWithPhishingPrevention",
  "collectionSharing",
  "creditMonitoring",
  "dataLeak",
  "devicesLimit",
  "identityRestoration",
  "identityTheftProtection",
  "multipleAccounts",
  "nudges",
  "passwordsLimit",
  "phoneSupport",
  "riskDetection",
  "secretManagement",
  "secureFiles",
  "secureNotes",
  "secureWiFi",
  "securityBreach",
  "sharingLimit",
  "scim",
  "sso",
  "sync",
  "yubikey",
] as const;
export type CapabilityKey = (typeof CapabilityKeys)[number];
export type Capabilities = Record<CapabilityKey, Capability>;
export interface FamilyMembership {
  familyId: number;
  isAdmin: boolean;
  name: string;
}
export interface NodeFamilyMembership {
  familyId: number;
  isAdmin: boolean;
  planName: string;
}
export interface AutoRenewInfo {
  theory: boolean;
  reality: boolean;
  trigger?: "automatic" | "manual" | null;
  periodicity?: "yearly" | "monthly" | "other" | null;
}
export interface PremiumStatus {
  statusCode?: PremiumStatusCode;
  billingInformation?: PremiumStatusBillingInfo;
  planName?: string;
  planType?: LegacyPlanType;
  planFeature?: PlanFeature;
  endDate?: number;
  autoRenewal?: boolean;
  autoRenewInfo?: AutoRenewInfo;
  spaces?: PremiumStatusSpace[];
  capabilities?: Capabilities;
  familyMembership?: FamilyMembership;
  previousPlan?: PreviousPremiumPlan | false;
  autoRenewalFailed?: boolean;
  recoveryHash?: string;
}
export interface AccountInfo {
  premiumStatus?: PremiumStatus;
}
export interface DeviceInfo {
  deviceId: string;
  deviceName: string | null;
  devicePlatform: string | null;
  creationDate: number;
  lastUpdateDate: number;
}
export interface GetDevicesList {
  devicesList: DeviceInfo[];
}
export interface AskWebsiteInfo {
  fullUrl: string;
}
export interface WebsiteOptions {
  disabledAutofillOnDomain: boolean;
  disabledAutofillOnPage: boolean;
  disabledAutologinOnDomain: boolean;
  disabledAutologinOnPage: boolean;
  disabledFromSpaces: boolean;
}
export interface AnalysisOptions {
  disabled: boolean;
  onlyFillLoginInfo: boolean;
}
export interface AutofillOptionsOnWebsite {
  autofillOnlyLoginFormsOnWholeDomain: boolean;
  autofillOnlyLoginFormsOnSpecificUrl: boolean;
}
export interface GetPasswordGenerationSettings {
  length?: number;
  digits?: boolean;
  letters?: boolean;
  symbols?: boolean;
  avoidAmbiguous?: boolean;
}
export interface GeneratePassword {
  password: string;
  strength: string;
}
export interface SaveGeneratedPassword {
  password: string;
  url?: string;
}
export const PremiumLogTypes = Object.freeze({
  freeTrialGranted: "free_trial_granted",
  premiumGranted: "premium_granted",
  renewed: "renewed",
  subscribed: "subscribed",
  crosssellPurchased: "crosssell_purchased",
  setAsLegacy: "set_as_legacy",
  familyCreated: "family_created",
  familyRenewed: "family_renewed",
});
export type PremiumLogType = ValuesType<typeof PremiumLogTypes>;
export type PlanType = ValuesType<typeof PlanTypes>;
export type LegacyPlanType = PlanType;
export const PlanTypes = Object.freeze({
  Amazon: "amazon",
  FreeTrial: "free_trial",
  Invoice: "invoice",
  IOS: "ios",
  IOSRenewable: "ios_renewable",
  Legacy: "legacy",
  Mac: "mac",
  MacRenewable: "mac_renewable",
  Offer: "offer",
  Partner: "partner",
  Paypal: "paypal",
  PaypalRenewable: "paypal_renewable",
  Playstore: "playstore",
  PlaystoreRenewable: "playstore_renewable",
  Stripe: "stripe",
});
export type PlanFeature =
  | "single-mobile-sync"
  | "sync"
  | "premiumplus"
  | ""
  | "backup-for-all"
  | "essentials"
  | "advanced";
export interface Invoice {
  invoiceId: number;
  eventType: string;
  startDate: number;
  duration: string;
  amountPaid: number;
  taxes: number;
  currency: string;
  equivalentCharge: number;
  discountRatio: number;
  planType: string;
  planFeature?: string;
}
export interface GetInvoices {
  invoices: Invoice[];
}
export interface DeactivateDevice {
  deviceId: string;
}
export type RememberMeType = "autologin" | "webauthn" | "sso" | "disabled";
export type LoginType =
  | "SSO"
  | "Biometric"
  | "DeviceToDevice"
  | "MasterPassword"
  | "ARK"
  | "Autologin"
  | "CreatedPasswordlessAccount";
export interface LocalAccountInfo {
  login: string;
  hasLoginOtp: boolean;
  isLastSuccessfulLogin: boolean;
  rememberMeType?: RememberMeType;
  shouldAskMasterPassword?: boolean;
}
export interface LocalAccountsListUpdated {
  localAccounts: LocalAccountInfo[];
}
export interface GetLocalAccountsList {
  localAccounts: LocalAccountInfo[];
}
export interface LoginStatusChanged {
  loggedIn: boolean;
  login: string;
  needsSSOMigration?: boolean;
}
export interface OpenSessionProgressChanged {
  statusDescription: string;
  statusProgress: number;
}
export interface OpenSessionTokenSent {
  isResendAction: boolean;
  login: string;
}
export interface OpenSessionOTPSent {
  hasU2F: boolean;
}
export interface OpenSessionAskMasterPassword {
  login: string;
}
export interface OpenSessionTokenWarning {
  isTokenLocked: boolean;
  remainingAttempts: number;
  email: string;
}
export interface OpenSessionSsoRedirectionToIdpRequired {
  serviceProviderRedirectUrl: string;
  isNitroProvider: boolean;
}
export interface OpenSessionFailed {
  errorCode: string;
  displayErrorCode: boolean;
  additionalErrorInfo: string;
}
export interface UsersMetadataRequest {
  lastLogin: string;
  logins: string[];
}
export interface RetrieveCredentialLoginUrl {
  requestId?: string;
  credentialId: string;
}
export interface ResumeSession {}
export interface ChangeUserCryptoPayloadSettings {
  payload: "argon2" | "pbkdf2_flexible_marker" | "pbkdf2_kwc3";
}
export interface OpenSession {
  login: string;
  password?: string | null;
}
export interface OpenSessionWithToken {
  login: string;
  password?: string | null;
  token: string;
  persistData: boolean;
  deviceName?: string;
}
export interface OpenSessionWithDashlaneAuthenticator {
  login: string;
  password?: string | null;
  persistData: boolean;
  deviceName?: string;
}
export interface OpenSessionWithOTP {
  login: string;
  password?: string | null;
  otp: string;
  withBackupCode?: boolean;
}
export interface OpenSessionWithOTPForNewDevice {
  login: string;
  password?: string | null;
  otp: string;
  persistData: boolean;
  deviceName?: string;
  withBackupCode?: boolean;
}
export const groupPermissions: AdminPermissionLevel[] = [
  "GROUP_CREATE",
  "GROUP_DELETE",
  "GROUP_EDIT",
  "GROUP_READ",
];
export const possibleAdminPermissions: AdminPermissionLevel[] = [
  "FULL",
  "BILLING",
  ...groupPermissions,
];
export type AdminPermissionLevel =
  | "FULL"
  | "BILLING"
  | "GROUP_CREATE"
  | "GROUP_DELETE"
  | "GROUP_EDIT"
  | "GROUP_READ";
export interface OpenSessionWithMasterPassword {
  login: string;
  password: string;
  rememberPassword?: boolean;
  requiredPermissions?: AdminPermissionLevel;
  serverKey?: string;
  isAccountRecoveryKeyFlow?: boolean;
  loginType: LoginType;
}
export interface OpenSessionResendToken {
  login: string;
}
export interface OpenDevSession {
  login: string;
  UKI: string;
  password: string;
}
export interface PersistUISettings {
  key: string;
  data: string;
}
export interface SessionForceSync {
  trigger?: Trigger;
}
export interface CloseSession {}
export interface LockSession {}
export interface SessionSyncStatus {
  status: "syncing" | "success" | "error";
}
export interface AccountFeatures {
  lastUpdate?: number;
  list: {
    [key: string]: boolean;
  };
  pluginCapacitiesList?: {
    [key: string]: boolean;
  };
}
export enum ServerSidePairingStatus {
  UNPAIRED,
  PAIRED,
}
export interface ServerSidePairingStatusChanged {
  serverSidePairingStatus: ServerSidePairingStatus;
}
export type SSOMigrationInfo = Pick<
  SSOSettingsData,
  "serviceProviderUrl" | "migration"
>;
export interface LocalAccountInfo {
  login: string;
  hasLoginOtp: boolean;
  isLastSuccessfulLogin: boolean;
  rememberMeType?: RememberMeType;
  shouldAskMasterPassword?: boolean;
}
export interface DeviceKeys {
  accessKey: string;
  secretKey: string;
}
export interface SessionInfo {
  password: string;
  serverKey?: string;
  localKey?: string;
  cryptoUserPayload?: string;
  cryptoFixedSalt?: string;
  devicesKeys?: DeviceKeys;
}
export interface UserCryptoSettings {
  cryptoUserPayload?: string;
  cryptoFixedSalt?: string;
}
export enum SyncStatuses {
  READY = "ready",
  IN_PROGRESS = "in_progress",
  SUCCESS = "success",
  FAILURE = "failure",
}
export interface SyncState {
  startTime?: number;
  isUploadEnabled: boolean;
  syncIntervalTimeMs: number;
  status: SyncStatuses;
}
interface TeamInfo {
  name?: string;
  membersNumber: number;
  planType: string;
  teamDomains?: string[];
  letter?: string;
  color?: string;
  forcedDomainsEnabled?: boolean;
  personalSpaceEnabled?: boolean;
  removeForcedContentEnabled?: boolean;
  recoveryEnabled?: boolean;
  sharingRestrictedToTeam?: boolean;
  ssoEnabled?: boolean;
  ssoActivationType?: string;
  ssoProvisioning?: string;
  vaultExportEnabled?: boolean;
}
export interface TeamMembership {
  teamAdmins: {
    login: string;
  }[];
  billingAdmins: {
    login: string;
  }[];
  isTeamAdmin: boolean;
  isBillingAdmin: boolean;
  isGroupManager: boolean;
  isSSOUser: boolean;
}
interface BaseTeam {
  teamId: number;
  teamName?: string;
  planFeature: SpaceTier;
  joinDateUnix: number;
  invitationDateUnix?: number;
  associatedEmail?: string;
  teamMembership: TeamMembership;
  teamInfo: TeamInfo;
}
interface CurrentTeam extends BaseTeam {
  planName: string;
  recoveryHash?: string;
  isRenewalStopped?: boolean;
  isSoftDiscontinued: boolean;
  hasPaid?: boolean;
  isTrial?: boolean;
  hasBeenInTrial?: boolean;
}
interface PastTeam extends BaseTeam {
  status: string;
  revokeDateUnix: number;
  shouldDelete?: boolean;
}
enum B2BOneTeamStatus {
  not_in_team = "not_in_team",
  proposed = "proposed",
  in_team = "in_team",
}
export const B2CPlanFeatures = Object.freeze({
  Premium: "premium",
  Essentials: "essentials",
  Premiumplus: "premiumplus",
  BackupForAll: "backup-for-all",
});
export type B2CPlanFeature = ValuesType<typeof B2CPlanFeatures>;
export interface PlanMinified {
  planName: string;
  endDateUnix: number;
}
export interface B2BStatus {
  statusCode: keyof typeof B2BOneTeamStatus;
  currentTeam?: CurrentTeam;
  pastTeams?: PastTeam[];
  hasPaid?: boolean;
}
export interface NodePremiumStatus {
  currentTimestampUnix?: number;
  statusCode: PremiumStatusCode;
  isTrial?: boolean;
  isPaid?: boolean;
  autoRenewal?: boolean;
  planName?: string;
  planType?: PlanType;
  planFeature?: B2CPlanFeature;
  startDateUnix?: number;
  endDateUnix?: number;
  previousPlan?: PlanMinified;
  familyStatus?: NodeFamilyMembership;
  spaces?: PremiumStatusSpace[];
  b2bStatus?: B2BStatus;
  capabilities?: Capabilities;
}
export interface B2CSubscription {
  billingInformation?: BillingInformation;
  autoRenewInfo?: AutoRenewInfo;
  hasInvoices: boolean;
}
export interface B2BSubscription {
  planDetails?: {
    type?: "stripe" | "free_trial" | "offer" | "invoice";
    duration?: "monthly" | "yearly" | "other";
  };
  billingInformation?: BillingInformation;
  hasInvoices: boolean;
}
export interface BillingInformation {
  last4?: string;
  billingType: string;
  exp_month?: number;
  exp_year?: number;
  fingerprint?: string;
  country?: string;
  name?: string;
  address_line1?: string;
  address_line2?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  address_country?: string;
  cvc_check?: string;
  address_line1_check?: string;
  address_zip_check?: string;
  type?: string;
}
export interface SubscriptionInformation {
  b2cSubscription: B2CSubscription;
  b2bSubscription?: B2BSubscription;
}
export const SpaceTiers = Object.freeze({
  Team: "team",
  Business: "business",
  Legacy: "legacy",
  Entreprise: "entreprise",
  Free: "free",
  Starter: "starter",
  Standard: "standard",
  BusinessPlus: "businessplus",
});
export type SpaceTier = ValuesType<typeof SpaceTiers>;
export enum SpaceStatus {
  Accepted = "accepted",
  Pending = "pending",
  Proposed = "proposed",
  Refused = "refused",
  Removed = "removed",
  Revoked = "revoked",
  Unproposed = "unproposed",
}
export interface PremiumStatusSpace {
  associatedEmail: string;
  billingAdmins: {
    login: string;
  }[];
  color: string;
  companyName: string;
  info: {
    [settingName: string]: any;
  };
  invitationDate: number;
  isBillingAdmin: boolean;
  isSSOUser: boolean;
  isTeamAdmin: boolean;
  isGroupManager?: boolean;
  joinDate: number;
  letter: string;
  membersNumber: number;
  planType: string;
  revokeDate: number;
  status: string;
  teamAdmins: {
    login: string;
  }[];
  teamId: string;
  teamName: string;
  tier: SpaceTier;
  shouldDelete: boolean;
}
export enum SSOMigrationType {
  MP_TO_SSO,
  MP_TO_SSO_WITH_INFO,
  SSO_TO_MP,
}
export interface SSOSettingsData {
  ssoUser: boolean;
  serviceProviderUrl: string;
  migration?: SSOMigrationType;
  ssoServiceProviderKey?: string;
  ssoToken?: string;
  isNitroProvider?: boolean;
}
export type SSOProviderInfo = Pick<
  SSOSettingsData,
  "isNitroProvider" | "serviceProviderUrl"
>;
export enum CredentialSearchOrder {
  NAME = "name",
  DATE = "date",
}
export interface CredentialSearchOrderRequest {
  order: CredentialSearchOrder;
}
export type AccountAuthenticationType =
  | "masterPassword"
  | "invisibleMasterPassword";
export interface ConvertTokenToAuthTicketSuccess {
  success: true;
  authTicket: string;
}
export interface ConvertTokenToAuthTicketError {
  success: false;
  error: {
    code: AuthenticationCode;
    message?: string;
  };
}
export type ConvertTokenToAuthTicketResult =
  | ConvertTokenToAuthTicketSuccess
  | ConvertTokenToAuthTicketError;
export interface EmailToken {
  type: "emailToken";
  value: string;
}
export interface OTP {
  type: "otp";
  value: string;
}
export interface ExtraDeviceToken {
  type: "extraDeviceToken";
  value: string;
}
export interface SSOToken {
  type: "sso";
  value: string;
}
export type VerificationToken = EmailToken | OTP | ExtraDeviceToken | SSOToken;
export type VerificationTokenRequest = VerificationToken;
export type VerificationTokenResponse = ConvertTokenToAuthTicketResult;
