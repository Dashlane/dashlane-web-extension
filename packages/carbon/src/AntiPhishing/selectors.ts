import { State } from "Store";
export const antiPhishingURLListSelector = (state: State): Set<string> =>
  state.device.antiPhishing;
