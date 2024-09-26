import { KillSwitches } from "@dashlane/framework-contracts";
import { Query } from "Shared/Api";
export type KillswitchQueries = {
  getIsBrazeContentDisabled: Query<void, boolean>;
  getIsLoginFlowMigrationDisabled: Query<void, boolean>;
  getIsAutoSSOLoginDisabled: Query<void, boolean>;
  getKillSwitch: Query<KillSwitches, boolean>;
};
