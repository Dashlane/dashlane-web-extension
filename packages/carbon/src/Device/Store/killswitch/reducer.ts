import { shallowEqual } from "shallow-equal";
import {
  KILLSWITCH_STATE_UPDATED,
  KillswitchState,
  KillswitchUpdatedAction,
} from "Device/Store/killswitch/types";
export const DEFAULT_EMPTY_KILLSWITCH_STATE = Object.freeze({
  disableAutofill: false,
  disableLoginFlowMigration: false,
  brazeContentCardsDisabled: false,
  disableAutoSSOLogin: false,
});
export function getEmptyKillswitchState(): KillswitchState {
  return DEFAULT_EMPTY_KILLSWITCH_STATE;
}
export const killswitchReducer = (
  state = getEmptyKillswitchState(),
  action: KillswitchUpdatedAction
): KillswitchState => {
  switch (action.type) {
    case KILLSWITCH_STATE_UPDATED:
      return shallowEqual(state, action.killswitchState)
        ? state
        : {
            ...state,
            ...action.killswitchState,
          };
    default:
      return state;
  }
};
