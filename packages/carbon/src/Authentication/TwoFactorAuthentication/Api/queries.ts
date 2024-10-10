import { Query } from "Shared/Api";
import { U2FAuthenticatorsQueries } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/Api/queries";
import { TwoFactorAuthenticationInfo } from "@dashlane/communication";
export type TwoFactorAuthenticationQueries = {
  getTwoFactorAuthenticationInfo: Query<void, TwoFactorAuthenticationInfo>;
} & U2FAuthenticatorsQueries;
