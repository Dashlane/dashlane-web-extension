import {
  DriverLicenseAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { getAutofillDataFromVault } from "../../../../abstractions/vault/get";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import { EnhancedWebcardItem, WebcardItemType } from "../../../../../types";
import { convertSpaceInfoForWebcard } from "../../converters";
import {
  buildItemProperties,
  getExpirationWarningsForEnhancedWebcardItems,
} from "../../utils";
import { getDisplayUECountryName } from "../Countries/helpers";
import { getBackgroundNameForDriversLicense } from "./helpers";
export const buildDriverLicenseItemProperties = async (
  context: AutofillEngineContext,
  driverLicenseId: string
) => {
  const driverLicenseItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.DriverLicense,
    driverLicenseId
  );
  return driverLicenseItem
    ? buildItemProperties(
        context,
        VaultSourceType.DriverLicense,
        driverLicenseItem,
        ["issueDateFull", "expirationDateFull", "state", "idNumber"]
      )
    : {};
};
export const getFormattedDriverLicenseWebcardData = (
  driverLicenseItem: DriverLicenseAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): EnhancedWebcardItem => {
  const { expirationMonth, expirationYear } = driverLicenseItem;
  const { expired, aboutToExpire } =
    getExpirationWarningsForEnhancedWebcardItems(
      expirationMonth,
      expirationYear,
      driverLicenseItem.vaultType
    );
  const backgroundName = getBackgroundNameForDriversLicense(driverLicenseItem);
  return {
    type: WebcardItemType.EnhancedItem,
    itemId: driverLicenseItem.id,
    itemType: VaultSourceType.DriverLicense,
    title: driverLicenseItem.name,
    content: driverLicenseItem.localeFormat,
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    expired,
    aboutToExpire: aboutToExpire && !expired,
    isProtected: false,
    displayCountry: getDisplayUECountryName(driverLicenseItem.localeFormat),
    country: driverLicenseItem.localeFormat,
    backgroundName,
  };
};
