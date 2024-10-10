import { RefreshTwoFactorAuthenticationInfoResult } from "@dashlane/communication";
import { Command } from "Shared/Api";
import { U2FAuthenticatorsCommands } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/Api/commands";
export type TwoFactorAuthenticationCommands = {
  refreshTwoFactorAuthenticationInfo: Command<
    void,
    RefreshTwoFactorAuthenticationInfoResult
  >;
} & U2FAuthenticatorsCommands;
