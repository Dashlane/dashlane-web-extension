import { LiveQuery } from "Shared/Api";
import { ReactivationStatus } from "Authentication/Store/localAccounts/types";
import { WebAuthnAuthenticationLiveQueries } from "Authentication/WebAuthnAuthentication/Api/live-queries";
import { TwoFactorAuthenticationEnableLiveQueries } from "Authentication/TwoFactorAuthentication/Flow/Enable/Api/live-queries";
import { TwoFactorAuthenticationDisableLiveQueries } from "Authentication/TwoFactorAuthentication/Flow/Disable/Api/live-queries";
import { TwoFactorAuthenticationLiveQueries } from "Authentication/TwoFactorAuthentication/Api/live-queries";
export type AuthenticationLiveQueries = {
  liveReactivationStatus: LiveQuery<void, ReactivationStatus>;
} & WebAuthnAuthenticationLiveQueries &
  TwoFactorAuthenticationEnableLiveQueries &
  TwoFactorAuthenticationDisableLiveQueries &
  TwoFactorAuthenticationLiveQueries;
