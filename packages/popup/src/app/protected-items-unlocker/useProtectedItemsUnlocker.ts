import * as React from "react";
import { ProtectedItemsUnlockerContext } from "./protected-items-unlocker-context";
const useProtectedItemsUnlocker = () => {
  return React.useContext(ProtectedItemsUnlockerContext);
};
export default useProtectedItemsUnlocker;
