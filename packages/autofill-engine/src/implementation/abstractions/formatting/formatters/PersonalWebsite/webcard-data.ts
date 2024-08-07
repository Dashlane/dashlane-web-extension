import {
  PersonalWebsiteAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import { SomeDataCaptureWebcardItem } from "../../../../../Api/types/data-capture";
import { SimpleWebcardItem, WebcardItemType } from "../../../../../types";
import { CapturedValuesAndProperties } from "../../../../modules/dataCapture/personal-data-capture-helpers";
import { getAutofillDataFromVault } from "../../../vault/get";
import { convertSpaceInfoForWebcard } from "../../converters";
import { buildItemProperties, findCapturedDataByProperty } from "../../utils";
export const buildPersonalWebsiteItemProperties = async (
  context: AutofillEngineContext,
  websiteId: string
) => {
  const websiteItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.PersonalWebsite,
    websiteId
  );
  return websiteItem
    ? buildItemProperties(
        context,
        VaultSourceType.PersonalWebsite,
        websiteItem,
        ["website"]
      )
    : {};
};
export const getFormattedPersonalWebsiteWebcardData = (
  personalWebsiteItem: PersonalWebsiteAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): SimpleWebcardItem => {
  return {
    type: WebcardItemType.SimpleItem,
    itemId: personalWebsiteItem.id,
    itemType: VaultSourceType.PersonalWebsite,
    title: personalWebsiteItem.website,
    content: personalWebsiteItem.name,
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    isProtected: false,
  };
};
export const getWebsiteDataCapture = (
  capturedData: CapturedValuesAndProperties<VaultSourceType>
): SomeDataCaptureWebcardItem<VaultSourceType.PersonalWebsite> | undefined => {
  if (!capturedData[0]) {
    return undefined;
  }
  return {
    type: VaultSourceType.PersonalWebsite,
    content: findCapturedDataByProperty(capturedData, "website")?.value ?? "",
    website: findCapturedDataByProperty(capturedData, "website")?.value ?? "",
  };
};
