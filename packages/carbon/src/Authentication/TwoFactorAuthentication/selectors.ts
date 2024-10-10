import { TwoFactorAuthenticationInfo } from "@dashlane/communication";
import { State } from "Store";
export const twoFactorAuthenticationInfoSelector = (
  state: State
): TwoFactorAuthenticationInfo => state.authentication.twoFactorAuthentication;
