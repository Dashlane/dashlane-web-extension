import {
  GeneratedPasswordAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { SimpleWebcardItem, WebcardItemType } from "../../../../../types";
import { convertSpaceInfoForWebcard } from "../../converters";
export const getFormattedGeneratedPasswordWebcardData = (
  generatedPasswordItem: GeneratedPasswordAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): SimpleWebcardItem => {
  return {
    type: WebcardItemType.SimpleItem,
    itemId: generatedPasswordItem.id,
    itemType: VaultSourceType.GeneratedPassword,
    title: "LAST_GENERATED_BUT_UNSAVED_PASSWORD",
    isTitleFixedType: true,
    content: generatedPasswordItem.domain,
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    isProtected: false,
    isLinkedWebsite: false,
  };
};
