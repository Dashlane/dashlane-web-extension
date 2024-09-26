import {
  KILLSWITCH_STATE_UPDATED,
  KillswitchState,
  KillswitchUpdatedAction,
} from "Device/Store/killswitch/types";
export const killswitchStateUpdated = (
  killswitchState: Partial<KillswitchState>
): KillswitchUpdatedAction => ({
  type: KILLSWITCH_STATE_UPDATED,
  killswitchState,
});
