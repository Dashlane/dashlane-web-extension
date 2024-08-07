import {
  IdCardAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import { getAutofillDataFromVault } from "../../../vault/get";
import { EnhancedWebcardItem, WebcardItemType } from "../../../../../types";
import { convertSpaceInfoForWebcard } from "../../converters";
import {
  buildItemProperties,
  getExpirationWarningsForEnhancedWebcardItems,
} from "../../utils";
import { getDisplayUECountryName } from "../Countries/helpers";
export const buildIdCardItemProperties = async (
  context: AutofillEngineContext,
  idCardId: string
) => {
  const idCardItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.IdCard,
    idCardId
  );
  return idCardItem
    ? buildItemProperties(context, VaultSourceType.IdCard, idCardItem, [
        "name",
        "country",
        "expirationDateFull",
        "expirationYear",
        "expirationMonth",
        "expirationDay",
        "issueDateFull",
        "issueYear",
        "issueMonth",
        "issueDay",
        "idNumber",
      ])
    : {};
};
export const getFormattedIdCardWebcardData = (
  idCardItem: IdCardAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): EnhancedWebcardItem => {
  const { expirationMonth, expirationYear } = idCardItem;
  const { expired, aboutToExpire } =
    getExpirationWarningsForEnhancedWebcardItems(
      expirationMonth,
      expirationYear,
      idCardItem.vaultType
    );
  return {
    type: WebcardItemType.EnhancedItem,
    itemId: idCardItem.id,
    itemType: VaultSourceType.IdCard,
    title: idCardItem.name,
    content: idCardItem.localeFormat,
    expired,
    aboutToExpire,
    country: idCardItem.localeFormat,
    displayCountry: getDisplayUECountryName(idCardItem.localeFormat),
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    isProtected: false,
  };
};
