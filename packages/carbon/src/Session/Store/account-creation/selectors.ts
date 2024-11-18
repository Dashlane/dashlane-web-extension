import { State } from "Store";
export const isSSOAccountCreationSelector = (state: State): boolean =>
  state.userSession.accountCreation.isSSO;
