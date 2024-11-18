import { State } from "Store/types";
export const sessionIdSelector = (state: State): number =>
  state.userSession.session.sessionId;
export const sessionStartTimeSelector = (state: State): number =>
  state.userSession.account.sessionStartTime;
