import { State } from "Store/types";
export const appSessionIdSelector = (state: State): number | undefined =>
  state.device.application.appSession.appSessionId;
