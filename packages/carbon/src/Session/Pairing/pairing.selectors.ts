import { State } from "Store";
export const isPairingEnabledSelector = (state: State): boolean =>
  Boolean(state.userSession.session.pairingId);
export const pairingIdSelector = (state: State): string | null =>
  state.userSession.session.pairingId;
