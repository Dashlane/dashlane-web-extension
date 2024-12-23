import { CredentialAutofillView } from "@dashlane/autofill-contracts";
import { FieldFormat } from "../../../../../types";
export function formatOTP(
  item: CredentialAutofillView,
  fieldFormat?: FieldFormat
): string {
  const fullValue = item.otpSecret;
  if (
    typeof fieldFormat?.partNumber === "number" &&
    fullValue.length > fieldFormat.partNumber
  ) {
    return fullValue[fieldFormat.partNumber];
  }
  return fullValue;
}
