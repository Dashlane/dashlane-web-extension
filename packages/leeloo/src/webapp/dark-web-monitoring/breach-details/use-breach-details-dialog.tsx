import * as React from "react";
import { BreachDetailsDialogContext } from "./breach-details-dialog-provider";
export function useBreachDetailsDialog() {
  return React.useContext(BreachDetailsDialogContext);
}
