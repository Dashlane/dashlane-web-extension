import {
  LocalAccountInfo,
  OtpType,
  ReactivationStatus,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
import { WebAuthnAuthenticationQueries } from "Authentication/WebAuthnAuthentication/Api/queries";
import { TwoFactorAuthenticationEnableQueries } from "Authentication/TwoFactorAuthentication/Flow/Enable/Api/queries";
import { TwoFactorAuthenticationDisableQueries } from "Authentication/TwoFactorAuthentication/Flow/Disable/Api/queries";
import { TwoFactorAuthenticationQueries } from "Authentication/TwoFactorAuthentication/Api/queries";
import { U2FAuthenticatorsQueries } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/Api/queries";
export type AuthenticationQueries = {
  getHasOtp2Type: Query<void, boolean>;
  getUserOtpType: Query<void, OtpType>;
  getLocalAccounts: Query<void, LocalAccountInfo[]>;
  getReactivationStatus: Query<void, ReactivationStatus>;
} & WebAuthnAuthenticationQueries &
  TwoFactorAuthenticationEnableQueries &
  TwoFactorAuthenticationDisableQueries &
  TwoFactorAuthenticationQueries &
  U2FAuthenticatorsQueries;
