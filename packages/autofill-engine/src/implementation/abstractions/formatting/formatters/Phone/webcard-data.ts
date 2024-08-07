import {
  PhoneAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { getAutofillDataFromVault } from "../../../vault/get";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import { SomeDataCaptureWebcardItem } from "../../../../../Api/types/data-capture";
import { SimpleWebcardItem, WebcardItemType } from "../../../../../types";
import { CapturedValuesAndProperties } from "../../../../modules/dataCapture/personal-data-capture-helpers";
import { convertSpaceInfoForWebcard } from "../../converters";
import { buildItemProperties, findCapturedDataByProperty } from "../../utils";
import { getCountryLocaleFromCountryName } from "../Countries/helpers";
export const buildPhoneItemProperties = async (
  context: AutofillEngineContext,
  phoneId: string
) => {
  const phoneItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.Phone,
    phoneId
  );
  return phoneItem
    ? buildItemProperties(context, VaultSourceType.Phone, phoneItem, [
        "number",
        "numberInternational",
      ])
    : {};
};
export function getFormattedPhoneWebcardData(
  phoneItem: PhoneAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): SimpleWebcardItem {
  return {
    type: WebcardItemType.SimpleItem,
    itemId: phoneItem.id,
    itemType: VaultSourceType.Phone,
    title: phoneItem.numberInternational,
    content: phoneItem.name,
    communicationType: phoneItem.type,
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    isProtected: false,
  };
}
export const getPhoneDataCapture = (
  capturedData: CapturedValuesAndProperties<VaultSourceType>
): SomeDataCaptureWebcardItem<VaultSourceType.Phone> | undefined => {
  if (!capturedData[0]) {
    return undefined;
  }
  const localeFormat = getCountryLocaleFromCountryName(
    findCapturedDataByProperty(capturedData, "country")?.value
  );
  return {
    type: VaultSourceType.Phone,
    content: findCapturedDataByProperty(capturedData, "number")?.value ?? "",
    number: findCapturedDataByProperty(capturedData, "number")?.value ?? "",
    localeFormat,
  };
};
