import { State } from "Store";
export const deviceNameSelector = (state: State) => {
  return state.userSession.localSettings.deviceName;
};
