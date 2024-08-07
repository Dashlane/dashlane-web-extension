import {
  FiscalIdAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import { SimpleWebcardItem, WebcardItemType } from "../../../../../types";
import { getAutofillDataFromVault } from "../../../vault/get";
import { convertSpaceInfoForWebcard } from "../../converters";
import { buildItemProperties } from "../../utils";
export const buildFiscalIdItemProperties = async (
  context: AutofillEngineContext,
  fiscalIdId: string
) => {
  const fiscalIdItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.FiscalId,
    fiscalIdId
  );
  return fiscalIdItem
    ? buildItemProperties(context, VaultSourceType.FiscalId, fiscalIdItem, [
        "idNumber",
      ])
    : {};
};
export const getFormattedFiscalIdWebcardData = (
  fiscalIdItem: FiscalIdAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): SimpleWebcardItem => {
  return {
    type: WebcardItemType.SimpleItem,
    itemId: fiscalIdItem.id,
    itemType: VaultSourceType.FiscalId,
    title: fiscalIdItem.idNumber,
    content: fiscalIdItem.localeFormat,
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    isProtected: false,
  };
};
