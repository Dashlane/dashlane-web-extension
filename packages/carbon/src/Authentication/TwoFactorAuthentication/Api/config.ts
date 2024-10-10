import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { twoFactorAuthenticationInfo$ } from "Authentication/TwoFactorAuthentication/live";
import { twoFactorAuthenticationInfoSelector } from "Authentication/TwoFactorAuthentication/selectors";
import { refreshTwoFactorAuthenticationInfoHandler } from "Authentication/TwoFactorAuthentication/handlers/refresh-two-factor-authentication-info";
import { TwoFactorAuthenticationCommands } from "Authentication/TwoFactorAuthentication/Api/commands";
import { TwoFactorAuthenticationLiveQueries } from "Authentication/TwoFactorAuthentication/Api/live-queries";
import { TwoFactorAuthenticationQueries } from "Authentication/TwoFactorAuthentication/Api/queries";
import { config as U2FAuthenticatorsCommandsQueryBusConfig } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/Api/config";
export const config: CommandQueryBusConfig<
  TwoFactorAuthenticationCommands,
  TwoFactorAuthenticationQueries,
  TwoFactorAuthenticationLiveQueries
> = {
  commands: {
    refreshTwoFactorAuthenticationInfo: {
      handler: refreshTwoFactorAuthenticationInfoHandler,
    },
    ...U2FAuthenticatorsCommandsQueryBusConfig.commands,
  },
  queries: {
    getTwoFactorAuthenticationInfo: {
      selector: twoFactorAuthenticationInfoSelector,
    },
    ...U2FAuthenticatorsCommandsQueryBusConfig.queries,
  },
  liveQueries: {
    liveTwoFactorAuthenticationInfo: {
      operator: twoFactorAuthenticationInfo$,
    },
    ...U2FAuthenticatorsCommandsQueryBusConfig.liveQueries,
  },
};
