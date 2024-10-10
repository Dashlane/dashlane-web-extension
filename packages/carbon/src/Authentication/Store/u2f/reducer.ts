import { U2F_DEVICES_UPDATED, U2FAuthenticationAction } from "./actions";
import { U2FAuthenticationState } from "./types";
export const getEmptyU2FAuthenticationState = (): U2FAuthenticationState => ({
  u2fDevices: [],
});
export const u2fAuthenticationReducer = (
  state = getEmptyU2FAuthenticationState(),
  action: U2FAuthenticationAction
): U2FAuthenticationState => {
  switch (action.type) {
    case U2F_DEVICES_UPDATED: {
      return {
        ...state,
        u2fDevices: action.devices,
      };
    }
    default:
      return state;
  }
};
