import { IdentityAutofillView } from "@dashlane/autofill-contracts";
import { getLanguage } from "@dashlane/framework-infra/spi";
import { parseDateFromVault } from "../Dates/helpers";
import { formatFullName } from "./vault-ingredient";
export const NBSP = "\u00A0";
export const formatFullNameWithPseudo = (
  identity: IdentityAutofillView
): string => {
  let fullName = formatFullName(identity);
  if (identity.pseudo) {
    fullName += ` (${identity.pseudo})`;
  }
  return fullName;
};
export const formatBirthInformationForWebcards = (
  identity: IdentityAutofillView
): string => {
  const parts: string[] = [];
  const language = getLanguage();
  const date = parseDateFromVault(identity.birthDate);
  if (date) {
    const month = date.toLocaleString(language, { month: "long" });
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().padStart(4, "0");
    parts.push(`${month}\u00A0${day},\u00A0${year}`);
  }
  if (identity.birthPlace) {
    parts.push(identity.birthPlace);
  }
  return parts.join(", ");
};
