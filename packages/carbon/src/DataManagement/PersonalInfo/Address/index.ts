import { defaultTo } from "ramda";
import { Diff } from "utility-types";
import {
  type Address,
  Country,
  type DataModelObject,
  type PersonalInfoItem,
  type SavePIAddress,
} from "@dashlane/communication";
import {
  makeNewPersonalDataItemBase,
  makeUpdatedPersonalDataItemBase,
} from "DataManagement/helpers";
import { getLocaleFormat, getValidState } from "DataManagement/services";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import Debugger from "Logs/Debugger";
export async function makeUpdatedAddress(
  updatedItem: SavePIAddress,
  existingItem: Address
): Promise<Address> {
  Debugger.log(`[Data] Updating existing Address with id: ${existingItem.Id}`);
  return {
    ...existingItem,
    ...makeUpdatedPersonalDataItemBase({
      existingItem,
      updatedItem,
      itemUpdateDate: getUnixTimestamp(),
    }),
    ...makeAddressSpecificProps(existingItem, updatedItem),
  };
}
export async function makeNewAddress(newItem: SavePIAddress): Promise<Address> {
  Debugger.log("[Data] Adding new Address");
  const address: Address = {
    ...makeNewPersonalDataItemBase(newItem),
    ...makeAddressSpecificProps(null, newItem),
  };
  return address;
}
export type MakeAddressSpecificResult = Diff<Address, DataModelObject>;
export function makeAddressSpecificProps(
  existingItem: PersonalInfoItem,
  updatedItem: SavePIAddress
): MakeAddressSpecificResult {
  const defaultToEmptyString = defaultTo("");
  const updatedItemContent = updatedItem.content;
  const countryCode = getLocaleFormat(existingItem, updatedItem);
  return {
    AddressFull: defaultToEmptyString(updatedItemContent.addressFull),
    AddressName:
      updatedItemContent.addressName ||
      defaultToEmptyString(updatedItemContent.addressFull),
    Building: defaultToEmptyString(updatedItemContent.building),
    City: defaultToEmptyString(updatedItemContent.city),
    Country: Country[countryCode].toLocaleLowerCase(),
    DigitCode: defaultToEmptyString(updatedItemContent.digitCode),
    Door: defaultToEmptyString(updatedItemContent.door),
    Floor: defaultToEmptyString(updatedItemContent.floor),
    LinkedPhone: defaultToEmptyString(updatedItemContent.linkedPhone),
    PersonalNote: defaultToEmptyString(updatedItemContent.personalNote),
    Receiver: defaultToEmptyString(updatedItemContent.receiver),
    Stairs: defaultToEmptyString(updatedItemContent.stairs),
    State: getValidState(countryCode, updatedItemContent.state),
    StateLevel2: defaultToEmptyString(updatedItemContent.stateLevel2),
    StateNumber: defaultToEmptyString(updatedItemContent.stateNumber),
    StreetName: defaultToEmptyString(updatedItemContent.streetName),
    StreetNumber: defaultToEmptyString(updatedItemContent.streetNumber),
    StreetTitle: defaultToEmptyString(updatedItemContent.streetTitle),
    ZipCode: defaultToEmptyString(updatedItemContent.zipCode),
  };
}
