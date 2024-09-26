import { slot } from "ts-event-bus";
import { KillSwitches } from "@dashlane/framework-contracts";
import { liveSlot } from "../CarbonApi";
export const killswitchQueriesSlots = {
  getIsBrazeContentDisabled: slot<void, boolean>(),
  getIsLoginFlowMigrationDisabled: slot<void, boolean>(),
  getIsAutoSSOLoginDisabled: slot<void, boolean>(),
  getKillSwitch: slot<KillSwitches, boolean>(),
};
export const killswitchLiveQueriesSlots = {
  liveIsBrazeContentDisabled: liveSlot<boolean>(),
  liveIsLoginFlowMigrationDisabled: liveSlot<boolean>(),
  liveIsAutoSSOLoginDisabled: liveSlot<boolean>(),
  liveKillSwitch: liveSlot<boolean>(),
};
