import { AddressAutofillView } from "@dashlane/autofill-contracts";
export const NBSP = "\u00A0";
export const getSpecificLineOfFullAddress = (
  address: AddressAutofillView,
  lineNr: number
): string => {
  const splitAddressLines = address.addressFull.split("\n");
  if (splitAddressLines.length > lineNr) {
    return splitAddressLines[lineNr];
  } else {
    return "";
  }
};
export const getFirstLineOfFullAddress = (
  address: AddressAutofillView
): string => getSpecificLineOfFullAddress(address, 0);
export const isAddressLocaleFromGBorIE = (
  address: AddressAutofillView
): boolean => ["GB", "IE"].includes(address.localeFormat);
