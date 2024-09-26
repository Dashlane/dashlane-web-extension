import { State } from "Store";
export const changeMPinProgressSelector = (state: State): boolean =>
  state.userSession.changeMPData.changeMPinProgress;
