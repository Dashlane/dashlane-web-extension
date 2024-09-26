import { KillSwitches } from "@dashlane/framework-contracts";
import { DEFAULT_EMPTY_KILLSWITCH_STATE } from "Device/Store/killswitch/reducer";
import { State } from "Store";
const killswitchBaseSelector = (state: State) =>
  state.device.killswitch || DEFAULT_EMPTY_KILLSWITCH_STATE;
export const disableBrazeContentCardsSelector = (state: State) =>
  killswitchBaseSelector(state).brazeContentCardsDisabled || false;
export const disableLoginFlowMigrationSelector = (state: State) =>
  killswitchBaseSelector(state).disableLoginFlowMigration || false;
export const disableAutoSSOLoginSelector = (state: State) =>
  killswitchBaseSelector(state).disableAutoSSOLogin;
export const killSwitchSelector = (state: State, killSwitch: KillSwitches) =>
  killswitchBaseSelector(state)[killSwitch];
export const getKillSwitchSelector = (killSwitch: KillSwitches) => {
  return (state: State) => killSwitchSelector(state, killSwitch);
};
