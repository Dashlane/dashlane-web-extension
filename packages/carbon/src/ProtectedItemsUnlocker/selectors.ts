import { State } from "Store";
import { isSSOUserSelector } from "Session/sso.selectors";
import {
  lastMasterPasswordCheckSelector,
  userLoginSelector,
} from "Session/selectors";
export const gracePeriodSelector = (state: State) =>
  /__REDACTED__/.test(userLoginSelector(state)) ? 5000 : 5 * 60 * 1000;
export const vaultLockDateSelector = (state: State) => {
  if (isSSOUserSelector(state)) {
    return null;
  }
  return lastMasterPasswordCheckSelector(state) + gracePeriodSelector(state);
};
