import {
  AddressAutofillView,
  CountriesForAutofill,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import {
  SimpleWebcardItem,
  SomeDataCaptureWebcardItem,
  WebcardItemType,
} from "../../../../../types";
import { CapturedValuesAndProperties } from "../../../../modules/dataCapture/personal-data-capture-helpers";
import { getAutofillDataFromVault } from "../../../vault/get";
import { convertSpaceInfoForWebcard } from "../../converters";
import { buildItemProperties, findCapturedDataByProperty } from "../../utils";
import { fullLocalizedCountry } from "../Countries/vault-ingredient";
import { getCountryLocaleFromCountryName } from "../Countries/helpers";
import {
  getFirstLineOfFullAddress,
  isAddressLocaleFromGBorIE,
  NBSP,
} from "./helpers";
export const buildAddressItemProperties = async (
  context: AutofillEngineContext,
  addressId: string
) => {
  const addressItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.Address,
    addressId
  );
  return addressItem
    ? buildItemProperties(context, VaultSourceType.Address, addressItem, [
        "addressFull",
        "city",
        "country",
        "door",
        "floor",
        "state",
        "stateCode",
        "streetName",
        "streetNumber",
        "streetTitle",
        "zipCode",
      ])
    : {};
};
export const getFormattedAddressWebcardData = (
  addressItem: AddressAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): SimpleWebcardItem => {
  const country = fullLocalizedCountry(addressItem.localeFormat);
  const addressLine1 = getFirstLineOfFullAddress(addressItem);
  const addressLineWithStreet = isAddressLocaleFromGBorIE(addressItem)
    ? `${addressItem.streetNumber} ${addressLine1}`
    : addressLine1;
  const addressCityZip = isAddressLocaleFromGBorIE(addressItem)
    ? `${addressItem.city} ${addressItem.zipCode}`
    : `${addressItem.zipCode} ${addressItem.city}`;
  const addressCityZipCountry = `${addressCityZip} ${country}`;
  const content = `${addressItem.addressName}${NBSP.repeat(2)}-${NBSP.repeat(
    2
  )}${addressCityZipCountry}`;
  return {
    type: WebcardItemType.SimpleItem,
    itemId: addressItem.id,
    itemType: VaultSourceType.Address,
    title: addressLineWithStreet,
    content,
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    isProtected: false,
  };
};
export const getAddressDataCapture = (
  capturedData: CapturedValuesAndProperties<VaultSourceType>
): SomeDataCaptureWebcardItem<VaultSourceType.Address> | undefined => {
  if (!capturedData[0]) {
    return undefined;
  }
  const capturedCountry =
    findCapturedDataByProperty(capturedData, "country")?.value ?? "";
  const localeFormat = getCountryLocaleFromCountryName(capturedCountry);
  const country =
    localeFormat !== CountriesForAutofill.NO_TYPE
      ? fullLocalizedCountry(localeFormat)
      : capturedCountry;
  const content = [
    findCapturedDataByProperty(capturedData, "addressFull")?.value,
    findCapturedDataByProperty(capturedData, "city")?.value,
    country,
  ]
    .filter(Boolean)
    .join(`,${NBSP}`);
  return {
    type: VaultSourceType.Address,
    content,
    addressFull:
      findCapturedDataByProperty(capturedData, "addressFull")?.value ?? "",
    city: findCapturedDataByProperty(capturedData, "city")?.value ?? "",
    zipCode: findCapturedDataByProperty(capturedData, "zipCode")?.value ?? "",
    country,
    localeFormat,
  };
};
