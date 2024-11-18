import { isAuthenticatedSelector } from "Session/selectors";
import { State } from "Store";
export function shouldTriggerMasterPasswordLeakCheck(state: State): boolean {
  return isAuthenticatedSelector(state);
}
export async function shouldTriggerMasterPasswordWeakCheck(
  state: State
): Promise<boolean> {
  const isAuthenticated = isAuthenticatedSelector(state);
  if (!isAuthenticated) {
    return false;
  }
  return true;
}
