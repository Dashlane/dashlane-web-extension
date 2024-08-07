import { AddressAutofillView } from "@dashlane/autofill-contracts";
import { FieldFormat } from "../../../../../types";
import {
  getFirstLineOfFullAddress,
  getSpecificLineOfFullAddress,
} from "./helpers";
export function formatAddress(
  item: AddressAutofillView,
  fieldFormat?: FieldFormat
): string {
  if (typeof fieldFormat?.partNumber === "number") {
    return getSpecificLineOfFullAddress(item, fieldFormat.partNumber);
  }
  return getFirstLineOfFullAddress(item);
}
