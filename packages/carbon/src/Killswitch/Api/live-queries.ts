import { KillSwitches } from "@dashlane/framework-contracts";
import { LiveQuery } from "Shared/Api";
export type KillswitchLiveQueries = {
  liveIsBrazeContentDisabled: LiveQuery<void, boolean>;
  liveIsLoginFlowMigrationDisabled: LiveQuery<void, boolean>;
  liveIsAutoSSOLoginDisabled: LiveQuery<void, boolean>;
  liveKillSwitch: LiveQuery<KillSwitches, boolean>;
};
