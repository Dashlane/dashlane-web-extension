import { slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
import {
  AccountAuthenticationType,
  CredentialSearchOrder,
  CredentialSearchOrderRequest,
  GetLoginStatus,
  LocalAccountInfo,
  NodePremiumStatus,
  PremiumStatus,
  PremiumStatusSpace,
  SessionInfo,
  SSOMigrationInfo,
  SSOProviderInfo,
  SubscriptionInformation,
  SyncState,
  UserCryptoSettings,
  VerificationTokenRequest,
  VerificationTokenResponse,
} from "./types";
import { deviceLimitLiveSlots, deviceLimitSlots } from "./DeviceLimit/slots";
import {
  twoFactorStatusLiveSlots,
  twoFactorStatusSlots,
} from "./TwoFactor/slots";
import { MasterPasswordServerKeyResponse } from "../MasterPassword";
import { WebOnboardingModeEvent } from "../Onboarding";
import { PersonalSettings } from "../DataModel";
export const openSessionQueriesSlots = {
  getLoginStatus: slot<void, GetLoginStatus>(),
  getLocalAccounts: slot<void, LocalAccountInfo[]>(),
  getIsSSOUser: slot<void, boolean>(),
  getSSOMigrationInfo: slot<void, SSOMigrationInfo>(),
  getSessionInfo: slot<void, SessionInfo>(),
  getMasterPasswordAndServerKey: slot<void, MasterPasswordServerKeyResponse>(),
  getUserCryptoSettings: slot<void, UserCryptoSettings>(),
  getSyncInfo: slot<void, SyncState>(),
  getIsSyncInProgress: slot<void, boolean>(),
  getPremiumStatus: slot<void, PremiumStatus>(),
  getNodePremiumStatus: slot<void, NodePremiumStatus>(),
  getSubscriptionInformation: slot<void, SubscriptionInformation>(),
  getActiveSpaces: slot<void, PremiumStatusSpace[]>(),
  getSSOProviderInfo: slot<void, SSOProviderInfo>(),
  getUserLogin: slot<void, string | undefined>(),
  getPublicUserId: slot<void, string>(),
  getAnalyticsInstallationId: slot<void, string>(),
  getUserLoginStatus: slot<void, GetLoginStatus>(),
  getWebOnboardingMode: slot<void, WebOnboardingModeEvent>(),
  getIsPaymentFailureChurningDismissed: slot<void, boolean>(),
  getCredentialSearchOrder: slot<void, CredentialSearchOrder>(),
  getDidOpen: slot<void, boolean>(),
  getPlatformName: slot<void, string>(),
  getAccountAuthenticationType: slot<void, AccountAuthenticationType>(),
  ...deviceLimitSlots,
  ...twoFactorStatusSlots,
};
export const openSessionLiveQueriesSlots = {
  liveLoginStatus: liveSlot<GetLoginStatus>(),
  liveDidOpen: liveSlot<boolean>(),
  liveIsSSOUser: liveSlot<boolean>(),
  liveSSOMigrationInfo: liveSlot<SSOMigrationInfo>(),
  liveSessionInfo: liveSlot<SessionInfo>(),
  liveSyncInfo: liveSlot<SyncState>(),
  liveIsSyncInProgress: liveSlot<boolean>(),
  livePremiumStatus: liveSlot<PremiumStatus>(),
  liveServiceProviderUrl: liveSlot<string>(),
  liveWebOnboardingMode: liveSlot<WebOnboardingModeEvent>(),
  liveSubscriptionInformation: liveSlot<SubscriptionInformation>(),
  ...deviceLimitLiveSlots,
  ...twoFactorStatusLiveSlots,
};
export const openSessionCommandsSlots = {
  validateToken: slot<VerificationTokenRequest, VerificationTokenResponse>(),
  validateMasterPassword: slot<string, boolean>(),
  resetProtectedItemAutofillTimer: slot<void, void>(),
  forceSync: slot<void, void>(),
  updatePremiumChurningDismissDate: slot<void, void>(),
  setCredentialSearchOrder: slot<CredentialSearchOrderRequest, void>(),
  refreshSubscriptionInformation: slot<void, SubscriptionInformation>(),
  updateAccountRecoveryKeyPersonalSettings: slot<
    Partial<PersonalSettings>,
    void
  >(),
};
