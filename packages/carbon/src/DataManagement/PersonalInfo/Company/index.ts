import { Diff } from "utility-types";
import { defaultTo } from "ramda";
import type {
  Company,
  DataModelObject,
  SavePICompany,
} from "@dashlane/communication";
import {
  makeNewPersonalDataItemBase,
  makeUpdatedPersonalDataItemBase,
} from "DataManagement/helpers";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import Debugger from "Logs/Debugger";
export async function makeUpdatedCompany(
  updatedItem: SavePICompany,
  existingItem: Company
): Promise<Company> {
  Debugger.log(`[Data] Updating existing Company with id: ${existingItem.Id}`);
  return {
    ...existingItem,
    ...makeUpdatedPersonalDataItemBase({
      existingItem,
      updatedItem,
      itemUpdateDate: getUnixTimestamp(),
    }),
    ...makeCompanySpecificProps(updatedItem),
  };
}
export async function makeNewCompany(newItem: SavePICompany): Promise<Company> {
  const company: Company = {
    ...makeNewPersonalDataItemBase(newItem),
    ...makeCompanySpecificProps(newItem),
  };
  return company;
}
export type MakeCompanySpecificResult = Diff<Company, DataModelObject>;
export function makeCompanySpecificProps(
  item: SavePICompany
): MakeCompanySpecificResult {
  const defaultToEmptyString = defaultTo("");
  return {
    JobTitle: defaultToEmptyString(item.content.jobTitle),
    Name: defaultToEmptyString(item.content.name),
    PersonalNote: defaultToEmptyString(item.content.personalNote),
  };
}
