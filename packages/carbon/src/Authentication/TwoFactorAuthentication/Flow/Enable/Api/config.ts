import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { TwoFactorAuthenticationEnableQueries } from "Authentication/TwoFactorAuthentication/Flow/Enable/Api/queries";
import { TwoFactorAuthenticationEnableLiveQueries } from "Authentication/TwoFactorAuthentication/Flow/Enable/Api/live-queries";
import { TwoFactorAuthenticationEnableCommands } from "Authentication/TwoFactorAuthentication/Flow/Enable/Api/commands";
import {
  backTwoFactorAuthenticationEnableFlow,
  continueTwoFactorAuthenticationEnableFlow,
  startTwoFactorAuthenticationEnableFlow,
  stopTwoFactorAuthenticationEnableFlow,
} from "Authentication/TwoFactorAuthentication/Flow/Enable/handlers";
import { getTwoFactorAuthenticationEnableStageData } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store/selectors";
import { twoFactorAuthenticationEnableFlow$ } from "Authentication/TwoFactorAuthentication/Flow/Enable/live";
export const config: CommandQueryBusConfig<
  TwoFactorAuthenticationEnableCommands,
  TwoFactorAuthenticationEnableQueries,
  TwoFactorAuthenticationEnableLiveQueries
> = {
  commands: {
    startTwoFactorAuthenticationEnableFlow: {
      handler: startTwoFactorAuthenticationEnableFlow,
    },
    continueTwoFactorAuthenticationEnableFlow: {
      handler: continueTwoFactorAuthenticationEnableFlow,
    },
    backTwoFactorAuthenticationEnableFlow: {
      handler: backTwoFactorAuthenticationEnableFlow,
    },
    stopTwoFactorAuthenticationEnableFlow: {
      handler: stopTwoFactorAuthenticationEnableFlow,
    },
  },
  queries: {
    getTwoFactorAuthenticationEnableStage: {
      selector: getTwoFactorAuthenticationEnableStageData,
    },
  },
  liveQueries: {
    liveTwoFactorAuthenticationEnableStage: {
      operator: twoFactorAuthenticationEnableFlow$,
    },
  },
};
