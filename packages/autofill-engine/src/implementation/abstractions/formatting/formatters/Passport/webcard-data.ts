import {
  PassportAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import { EnhancedWebcardItem, WebcardItemType } from "../../../../../types";
import { getAutofillDataFromVault } from "../../../vault/get";
import { convertSpaceInfoForWebcard } from "../../converters";
import {
  buildItemProperties,
  getExpirationWarningsForEnhancedWebcardItems,
} from "../../utils";
export const buildPassportItemProperties = async (
  context: AutofillEngineContext,
  passportId: string
) => {
  const passportItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.Passport,
    passportId
  );
  return passportItem
    ? buildItemProperties(context, VaultSourceType.Passport, passportItem, [
        "idNumber",
        "country",
        "expirationDateFull",
        "expirationDay",
        "expirationMonth",
        "expirationYear",
        "issueDateFull",
        "issueDay",
        "issueMonth",
        "issueYear",
      ])
    : {};
};
export const getFormattedPassportWebcardData = (
  passportItem: PassportAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): EnhancedWebcardItem => {
  const { expirationMonth, expirationYear } = passportItem;
  const { expired, aboutToExpire } =
    getExpirationWarningsForEnhancedWebcardItems(
      expirationMonth,
      expirationYear,
      passportItem.vaultType
    );
  return {
    type: WebcardItemType.EnhancedItem,
    itemId: passportItem.id,
    itemType: VaultSourceType.Passport,
    title: passportItem.name,
    content: passportItem.localeFormat,
    country: passportItem.localeFormat,
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    expired,
    aboutToExpire: aboutToExpire && !expired,
    isProtected: false,
  };
};
