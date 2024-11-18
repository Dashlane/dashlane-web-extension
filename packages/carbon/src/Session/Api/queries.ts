import {
  AccountAuthenticationType,
  CredentialSearchOrder,
  GetLoginStatus,
  MasterPasswordServerKeyResponse,
  NodePremiumStatus,
  PremiumStatus,
  PremiumStatusSpace,
  SessionInfo,
  SSOMigrationInfo,
  SSOProviderInfo,
  SubscriptionInformation,
  SyncState,
  UserCryptoSettings,
  WebOnboardingModeEvent,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type SessionQueries = {
  getMasterPasswordAndServerKey: Query<void, MasterPasswordServerKeyResponse>;
  getSyncInfo: Query<void, SyncState>;
  getIsSyncInProgress: Query<void, boolean>;
  getPremiumStatus: Query<void, PremiumStatus>;
  getNodePremiumStatus: Query<void, NodePremiumStatus>;
  getSubscriptionInformation: Query<void, SubscriptionInformation>;
  getActiveSpaces: Query<void, PremiumStatusSpace[]>;
  getIsSSOUser: Query<void, boolean>;
  getSSOMigrationInfo: Query<void, SSOMigrationInfo>;
  getSSOProviderInfo: Query<void, SSOProviderInfo>;
  getUserLogin: Query<void, string | undefined>;
  getPublicUserId: Query<void, string>;
  getAnalyticsInstallationId: Query<void, string>;
  getUserLoginStatus: Query<void, GetLoginStatus>;
  getLoginStatus: Query<void, GetLoginStatus>;
  getWebOnboardingMode: Query<void, WebOnboardingModeEvent>;
  getIsPaymentFailureChurningDismissed: Query<void, boolean>;
  getCredentialSearchOrder: Query<void, CredentialSearchOrder>;
  getDidOpen: Query<void, boolean>;
  getPlatformName: Query<void, string>;
  getAccountAuthenticationType: Query<void, AccountAuthenticationType>;
  getSessionInfo: Query<void, SessionInfo>;
  getUserCryptoSettings: Query<void, UserCryptoSettings>;
};
