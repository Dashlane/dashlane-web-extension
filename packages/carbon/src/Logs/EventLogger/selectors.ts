import { AppKeys } from "Session/Store/sdk/types";
import { State } from "Store";
export const styxKeysSelector = (state: State): AppKeys | null =>
  state.userSession.sdkAuthentication.styxKeys;
