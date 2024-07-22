import { VaultSourceType } from "@dashlane/autofill-contracts";
import { TranslateFn } from "app/context/i18n";
import { COMMUNICATION_TYPES_TO_TRANSLATIONS_MAP } from "./keys";
export const getItemSubtitle = (
  itemType: VaultSourceType,
  content: string,
  communicationType: string | undefined,
  title: string,
  translate: TranslateFn
) => {
  if (!communicationType) {
    return content;
  }
  const translatedCommunicationType = translate(
    COMMUNICATION_TYPES_TO_TRANSLATIONS_MAP[communicationType]
  );
  if (!translatedCommunicationType) {
    return content;
  }
  if (itemType === "Email") {
    return content === "" ? translatedCommunicationType : content;
  }
  if (itemType === "Phone") {
    return content && content !== title
      ? `${content} (${translatedCommunicationType})`
      : translatedCommunicationType;
  }
  return content;
};
