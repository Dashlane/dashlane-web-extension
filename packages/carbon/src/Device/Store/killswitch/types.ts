import { Action } from "redux";
import { KillSwitches } from "@dashlane/framework-contracts";
export type KillswitchState = {
  [killswitch in KillSwitches]: boolean | undefined;
};
export const KILLSWITCH_STATE_UPDATED = "KILLSWITCH_STATE_UPDATED";
export interface KillswitchUpdatedAction extends Action {
  type: typeof KILLSWITCH_STATE_UPDATED;
  killswitchState: Partial<KillswitchState>;
}
