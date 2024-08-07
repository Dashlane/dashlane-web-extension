import {
  BankAccountAutofillView,
  CountryForAutofill,
} from "@dashlane/autofill-contracts";
import { FieldFormat } from "../../../../../types";
import { FORMATTERS, ParsedIban } from "./helpers";
const parseIban = (
  fullIban: string,
  locale: CountryForAutofill
): ParsedIban => {
  const compact = fullIban.replace(/\s+/g, "").toUpperCase();
  const parsedIban: ParsedIban = {
    full: fullIban,
    compact,
    parts: [],
  };
  const formatter = FORMATTERS[locale];
  if (formatter?.partsPattern) {
    const parsedForParts = compact.match(formatter.partsPattern);
    parsedIban.parts = parsedForParts?.slice(1) ?? [];
  }
  return parsedIban;
};
export const formatIban = (
  item: BankAccountAutofillView,
  fieldFormat?: FieldFormat
): string => {
  const parsedIban = parseIban(item.IBAN, item.country);
  if (typeof fieldFormat?.partNumber === "number") {
    return parsedIban.parts[fieldFormat.partNumber] ?? "";
  }
  return parsedIban.compact;
};
