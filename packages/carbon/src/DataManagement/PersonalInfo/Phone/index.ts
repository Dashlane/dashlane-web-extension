import { Diff } from "utility-types";
import { defaultTo } from "ramda";
import {
  CountryCode,
  isValidNumber,
  parsePhoneNumber,
} from "libphonenumber-js";
import {
  Country,
  type DataModelObject,
  type Phone,
  PhoneType,
  type SavePIPhone,
} from "@dashlane/communication";
import {
  makeNewPersonalDataItemBase,
  makeUpdatedPersonalDataItemBase,
} from "DataManagement/helpers";
import { getPlatformInfo } from "Application/platform-info";
import { isProposedLocaleLocalized } from "DataManagement/services";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { removeNonDigitCharacters } from "Utils";
import Debugger from "Logs/Debugger";
export async function makeUpdatedPhone(
  updatedItem: SavePIPhone,
  existingItem: Phone
): Promise<Phone> {
  Debugger.log(`[Data] Updating existing Phone with id: ${existingItem.Id}`);
  return {
    ...existingItem,
    ...makeUpdatedPersonalDataItemBase({
      existingItem,
      updatedItem,
      itemUpdateDate: getUnixTimestamp(),
    }),
    ...makePhoneSpecificProps(updatedItem),
  };
}
export async function makeNewPhone(newItem: SavePIPhone): Promise<Phone> {
  Debugger.log("[Data] Adding new Phone");
  const phone: Phone = {
    ...makeNewPersonalDataItemBase(newItem),
    ...makePhoneSpecificProps(newItem),
  };
  return phone;
}
export type MakePhoneSpecificResult = Diff<Phone, DataModelObject>;
export function makePhoneSpecificProps(
  item: SavePIPhone
): MakePhoneSpecificResult {
  const defaultToEmptyString = defaultTo("");
  const { Number, NumberInternational, NumberNational } =
    parsePhoneNumbers(item);
  return {
    Number,
    NumberInternational,
    NumberNational,
    PersonalNote: defaultToEmptyString(item.content.personalNote),
    PhoneName: item.content.phoneName || NumberNational,
    Type: PhoneType[item.content.type] || PhoneType.PHONE_TYPE_ANY,
  };
}
export function parsePhoneNumbers(item: SavePIPhone): Partial<Phone> {
  const { localeFormat, number } = item.content;
  if (!number) {
    return {
      Number: "",
      NumberInternational: "",
      NumberNational: "",
    };
  }
  const isUpdatedLocaleFormatLocalized =
    isProposedLocaleLocalized(localeFormat);
  const country: CountryCode =
    (isUpdatedLocaleFormatLocalized &&
      (Country[localeFormat] as CountryCode)) ||
    Country[getPlatformInfo().country] ||
    Country.US;
  const isNumberValid = country
    ? isValidNumber(number, country)
    : isValidNumber(number);
  if (!isNumberValid) {
    return {
      Number: removeNonDigitCharacters(number),
      NumberInternational: number,
      NumberNational: number,
    };
  }
  const phoneNumber = parsePhoneNumber(number, country);
  const numberNational = phoneNumber.formatNational();
  const numberInternational = phoneNumber.formatInternational();
  return {
    Number: removeNonDigitCharacters(number),
    NumberInternational: numberInternational,
    NumberNational: numberNational,
  };
}
