import { AccountAuthenticationType } from "@dashlane/communication";
import { State } from "Store";
export const accountAuthenticationTypeSelector = (
  state: State
): AccountAuthenticationType =>
  state.userSession.account.accountAuthenticationType;
