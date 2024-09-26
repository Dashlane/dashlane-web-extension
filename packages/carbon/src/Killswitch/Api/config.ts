import { CommandQueryBusConfig, NoCommands } from "Shared/Infrastructure";
import { KillswitchQueries } from "Killswitch/Api/queries";
import { KillswitchLiveQueries } from "Killswitch/Api/live-queries";
import {
  disableAutoSSOLoginSelector,
  disableBrazeContentCardsSelector,
  disableLoginFlowMigrationSelector,
  killSwitchSelector,
} from "Killswitch/selectors";
import {
  disableAutoSSOLoginOperator$,
  disableBrazeContentCardsOperator$,
  disableLoginFlowMigrationOperator$,
  getKillSwitchOperator$,
} from "Killswitch/live";
export const config: CommandQueryBusConfig<
  NoCommands,
  KillswitchQueries,
  KillswitchLiveQueries
> = {
  commands: {},
  queries: {
    getIsBrazeContentDisabled: {
      selector: disableBrazeContentCardsSelector,
    },
    getIsLoginFlowMigrationDisabled: {
      selector: disableLoginFlowMigrationSelector,
    },
    getIsAutoSSOLoginDisabled: {
      selector: disableAutoSSOLoginSelector,
    },
    getKillSwitch: {
      selector: killSwitchSelector,
    },
  },
  liveQueries: {
    liveIsBrazeContentDisabled: {
      operator: disableBrazeContentCardsOperator$,
    },
    liveIsLoginFlowMigrationDisabled: {
      operator: disableLoginFlowMigrationOperator$,
    },
    liveIsAutoSSOLoginDisabled: {
      operator: disableAutoSSOLoginOperator$,
    },
    liveKillSwitch: {
      operator: getKillSwitchOperator$,
    },
  },
};
