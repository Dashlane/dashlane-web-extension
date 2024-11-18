import { carbonConnector } from "../../../carbonConnector";
export function unlockProtectedItems(masterPassword: string) {
  return carbonConnector.unlockProtectedItems(masterPassword);
}
