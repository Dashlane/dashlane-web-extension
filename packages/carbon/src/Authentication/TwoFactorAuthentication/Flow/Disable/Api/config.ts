import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { TwoFactorAuthenticationDisableQueries } from "Authentication/TwoFactorAuthentication/Flow/Disable/Api/queries";
import { TwoFactorAuthenticationDisableLiveQueries } from "Authentication/TwoFactorAuthentication/Flow/Disable/Api/live-queries";
import { TwoFactorAuthenticationDisableCommands } from "Authentication/TwoFactorAuthentication/Flow/Disable/Api/commands";
import {
  backTwoFactorAuthenticationDisableFlow,
  continueTwoFactorAuthenticationDisableFlow,
  startTwoFactorAuthenticationDisableFlow,
  stopTwoFactorAuthenticationDisableFlow,
} from "Authentication/TwoFactorAuthentication/Flow/Disable/handlers";
import { getTwoFactorAuthenticationDisableStageData } from "Authentication/TwoFactorAuthentication/Flow/Disable/Store/selectors";
import { twoFactorAuthenticationDisableFlow$ } from "Authentication/TwoFactorAuthentication/Flow/Disable/live";
export const config: CommandQueryBusConfig<
  TwoFactorAuthenticationDisableCommands,
  TwoFactorAuthenticationDisableQueries,
  TwoFactorAuthenticationDisableLiveQueries
> = {
  commands: {
    startTwoFactorAuthenticationDisableFlow: {
      handler: startTwoFactorAuthenticationDisableFlow,
    },
    continueTwoFactorAuthenticationDisableFlow: {
      handler: continueTwoFactorAuthenticationDisableFlow,
    },
    backTwoFactorAuthenticationDisableFlow: {
      handler: backTwoFactorAuthenticationDisableFlow,
    },
    stopTwoFactorAuthenticationDisableFlow: {
      handler: stopTwoFactorAuthenticationDisableFlow,
    },
  },
  queries: {
    getTwoFactorAuthenticationDisableStage: {
      selector: getTwoFactorAuthenticationDisableStageData,
    },
  },
  liveQueries: {
    liveTwoFactorAuthenticationDisableStage: {
      operator: twoFactorAuthenticationDisableFlow$,
    },
  },
};
