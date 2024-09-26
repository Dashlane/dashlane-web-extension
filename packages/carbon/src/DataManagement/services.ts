import {
  Country,
  type DataModelObject,
  isObjectLocalized,
  type SavePersonalDataItemEvent,
  type SavePIAddressFromUI,
  type SavePIPhoneFromUI,
} from "@dashlane/communication";
import { isStateValid } from "StaticData/GeographicStates/services";
import { getPlatformInfo } from "Application/platform-info";
import Debugger from "Logs/Debugger";
import { GeographicStateValue } from "@dashlane/autofill-contracts";
export type SaveFromUIWithEditableLocale =
  | SavePIPhoneFromUI
  | SavePIAddressFromUI;
export function getLocaleFormat(
  existingItem: DataModelObject,
  updatedItem: SavePersonalDataItemEvent
): Country {
  if (!isObjectLocalized(updatedItem)) {
    return Country.UNIVERSAL;
  }
  const saveContentLocaleFormat =
    Country[(<SaveFromUIWithEditableLocale>updatedItem).content.localeFormat];
  const isUpdatedLocaleFormatLocalized = isProposedLocaleLocalized(
    saveContentLocaleFormat
  );
  const currentLocalFormat =
    existingItem && existingItem.LocaleFormat
      ? existingItem.LocaleFormat
      : Country[getPlatformInfo().country] || Country.US;
  const localeFormat =
    saveContentLocaleFormat && isUpdatedLocaleFormatLocalized
      ? saveContentLocaleFormat
      : currentLocalFormat;
  return localeFormat;
}
export function isProposedLocaleLocalized(localeFormat: Country): boolean {
  return (
    !!Country[localeFormat] &&
    [Country.NO_TYPE, Country.UNIVERSAL].every((locale) => {
      return locale !== localeFormat;
    })
  );
}
export function getValidState(
  countryCode: Country,
  stateValue: GeographicStateValue
): string {
  const isValid = isStateValid(countryCode, stateValue);
  if (!isValid) {
    Debugger.log(
      `[Data] Given value (${stateValue}) is not a valid state value for country code ${countryCode}`
    );
    return "";
  }
  return stateValue;
}
