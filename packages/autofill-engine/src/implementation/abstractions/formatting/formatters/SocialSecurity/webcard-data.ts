import {
  SocialSecurityIdAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import { EnhancedWebcardItem, WebcardItemType } from "../../../../../types";
import { getAutofillDataFromVault } from "../../../vault/get";
import { convertSpaceInfoForWebcard } from "../../converters";
import { buildItemProperties } from "../../utils";
export const buildSocialSecurityItemProperties = async (
  context: AutofillEngineContext,
  socialSecurityId: string
) => {
  const socialSecurityItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.SocialSecurityId,
    socialSecurityId
  );
  return socialSecurityItem
    ? buildItemProperties(
        context,
        VaultSourceType.SocialSecurityId,
        socialSecurityItem,
        ["idNumber"]
      )
    : {};
};
export function getFormattedSocialSecurityWebcardData(
  socialSecurityIdItem: SocialSecurityIdAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): EnhancedWebcardItem {
  return {
    type: WebcardItemType.EnhancedItem,
    itemId: socialSecurityIdItem.id,
    itemType: VaultSourceType.SocialSecurityId,
    title: socialSecurityIdItem.name,
    content: socialSecurityIdItem.localeFormat,
    country: socialSecurityIdItem.localeFormat,
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    isProtected: true,
  };
}
