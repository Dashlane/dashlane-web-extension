import { LiveQuery } from "Shared/Api";
import { U2FAuthenticatorsLiveQueries } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/Api/live-queries";
import { TwoFactorAuthenticationInfo } from "@dashlane/communication";
export type TwoFactorAuthenticationLiveQueries = {
  liveTwoFactorAuthenticationInfo: LiveQuery<void, TwoFactorAuthenticationInfo>;
} & U2FAuthenticatorsLiveQueries;
