import {
  CompanyAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import { getAutofillDataFromVault } from "../../../vault/get";
import { SimpleWebcardItem, WebcardItemType } from "../../../../../types";
import { convertSpaceInfoForWebcard } from "../../converters";
import { buildItemProperties } from "../../utils";
export const buildCompanyItemProperties = async (
  context: AutofillEngineContext,
  companyId: string
) => {
  const companyItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.Company,
    companyId
  );
  return companyItem
    ? buildItemProperties(context, VaultSourceType.Company, companyItem, [
        "name",
        "jobTitle",
      ])
    : {};
};
export const getFormattedCompanyWebcardData = (
  companyItem: CompanyAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): SimpleWebcardItem => {
  return {
    type: WebcardItemType.SimpleItem,
    itemId: companyItem.id,
    itemType: VaultSourceType.Company,
    title: companyItem.name,
    content: companyItem.jobTitle,
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    isProtected: false,
  };
};
