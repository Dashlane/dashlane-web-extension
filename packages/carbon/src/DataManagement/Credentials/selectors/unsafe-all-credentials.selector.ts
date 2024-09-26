import { State } from "Store";
import { Credential } from "@dashlane/communication";
export const unsafeAllCredentialsSelector = (state: State): Credential[] =>
  state.userSession.personalData.credentials;
