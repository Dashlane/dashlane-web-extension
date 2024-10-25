import {
  GetLoginStatus,
  PremiumStatus,
  SessionInfo,
  SSOMigrationInfo,
  SubscriptionInformation,
  SyncState,
  WebOnboardingModeEvent,
} from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type SessionLiveQueries = {
  liveSyncInfo: LiveQuery<void, SyncState>;
  liveIsSyncInProgress: LiveQuery<void, boolean>;
  liveLoginStatus: LiveQuery<void, GetLoginStatus>;
  livePremiumStatus: LiveQuery<void, PremiumStatus>;
  liveServiceProviderUrl: LiveQuery<void, string>;
  liveWebOnboardingMode: LiveQuery<void, WebOnboardingModeEvent>;
  liveDidOpen: LiveQuery<void, boolean>;
  liveSubscriptionInformation: LiveQuery<void, SubscriptionInformation>;
  liveIsSSOUser: LiveQuery<void, boolean>;
  liveSSOMigrationInfo: LiveQuery<void, SSOMigrationInfo>;
  liveSessionInfo: LiveQuery<void, SessionInfo>;
};
