import { State } from "Store";
export const countAllCredentialsSelector = (state: State): number =>
  state.userSession.personalData.credentials.length;
