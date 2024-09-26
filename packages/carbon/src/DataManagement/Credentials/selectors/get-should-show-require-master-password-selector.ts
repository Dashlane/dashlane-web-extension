import { isSSOUserSelector } from "Session/sso.selectors";
import { State } from "Store";
export const shouldShowRequireMasterPasswordSelector = (
  state: State
): boolean => !isSSOUserSelector(state);
