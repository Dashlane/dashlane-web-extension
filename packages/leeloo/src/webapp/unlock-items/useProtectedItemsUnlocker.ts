import * as React from "react";
import { ProtectedItemsUnlockerContext } from "./protected-items-unlocker-provider";
export function useProtectedItemsUnlocker() {
  return React.useContext(ProtectedItemsUnlockerContext);
}
