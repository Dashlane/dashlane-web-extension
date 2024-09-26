import { Diff } from "utility-types";
import { defaultTo } from "ramda";
import type {
  DataModelObject,
  PersonalWebsite,
  SavePIPersonalWebsite,
} from "@dashlane/communication";
import {
  makeNewPersonalDataItemBase,
  makeUpdatedPersonalDataItemBase,
} from "DataManagement/helpers";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import Debugger from "Logs/Debugger";
export async function makeUpdatedPersonalWebsite(
  updatedItem: SavePIPersonalWebsite,
  existingItem: PersonalWebsite
): Promise<PersonalWebsite> {
  Debugger.log(
    `[Data] Updating existing PersonalWebsite with id: ${existingItem.Id}`
  );
  return {
    ...existingItem,
    ...makeUpdatedPersonalDataItemBase({
      existingItem,
      updatedItem,
      itemUpdateDate: getUnixTimestamp(),
    }),
    ...makePersonalWebsiteSpecificProps(updatedItem),
  };
}
export async function makeNewPersonalWebsite(
  newItem: SavePIPersonalWebsite
): Promise<PersonalWebsite> {
  Debugger.log("[Data] Adding new PersonalWebsite");
  const personalWebsite: PersonalWebsite = {
    ...makeNewPersonalDataItemBase(newItem),
    ...makePersonalWebsiteSpecificProps(newItem),
  };
  return personalWebsite;
}
export type MakePersonalWebsiteSpecificResult = Diff<
  PersonalWebsite,
  DataModelObject
>;
export function makePersonalWebsiteSpecificProps(
  item: SavePIPersonalWebsite
): MakePersonalWebsiteSpecificResult {
  const defaultToEmptyString = defaultTo("");
  return {
    Website: defaultToEmptyString(item.content.website),
    Name: defaultToEmptyString(item.content.name),
  };
}
