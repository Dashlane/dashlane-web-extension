import { Diff } from "utility-types";
import { defaultTo } from "ramda";
import type {
  DataModelObject,
  Identity,
  SavePIIdentity,
} from "@dashlane/communication";
import {
  makeNewPersonalDataItemBase,
  makeUpdatedPersonalDataItemBase,
} from "DataManagement/helpers";
import { Debugger } from "Logs/Debugger";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
export async function makeUpdatedIdentity(
  updatedItem: SavePIIdentity,
  existingItem: Identity
): Promise<Identity> {
  Debugger.log(`[Data] Updating existing Identity with id: ${existingItem.Id}`);
  return {
    ...existingItem,
    ...makeUpdatedPersonalDataItemBase({
      existingItem,
      updatedItem,
      itemUpdateDate: getUnixTimestamp(),
    }),
    ...makeIdentitySpecificProps(updatedItem),
  };
}
export async function makeNewIdentity(
  newItem: SavePIIdentity
): Promise<Identity> {
  Debugger.log("[Data] Adding new Identity");
  const identity: Identity = {
    ...makeNewPersonalDataItemBase(newItem),
    ...makeIdentitySpecificProps(newItem),
  };
  return identity;
}
export type MakeIdentitySpecificResult = Diff<Identity, DataModelObject>;
export function makeIdentitySpecificProps(
  item: SavePIIdentity
): MakeIdentitySpecificResult {
  const defaultToEmptyString = defaultTo<"">("");
  return {
    FirstName: defaultToEmptyString(item.content.firstName),
    MiddleName: defaultToEmptyString(item.content.middleName),
    LastName: defaultToEmptyString(item.content.lastName),
    LastName2: defaultToEmptyString(item.content.lastName2),
    Pseudo: defaultToEmptyString(item.content.pseudo),
    BirthDate: defaultToEmptyString(item.content.birthDate),
    BirthPlace: defaultToEmptyString(item.content.birthPlace),
    Title: defaultToEmptyString(item.content.title),
  };
}
