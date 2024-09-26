import { Diff } from "utility-types";
import { defaultTo } from "ramda";
import type {
  DataModelObject,
  Email,
  SavePIEmail,
} from "@dashlane/communication";
import {
  makeNewPersonalDataItemBase,
  makeUpdatedPersonalDataItemBase,
} from "DataManagement/helpers";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import Debugger from "Logs/Debugger";
export async function makeUpdatedEmail(
  updatedItem: SavePIEmail,
  existingItem: Email
): Promise<Email> {
  Debugger.log(`[Data] Updating existing Email with id: ${existingItem.Id}`);
  return {
    ...existingItem,
    ...makeUpdatedPersonalDataItemBase({
      existingItem,
      updatedItem,
      itemUpdateDate: getUnixTimestamp(),
    }),
    ...makeEmailSpecificProps(updatedItem),
  };
}
export async function makeNewEmail(newItem: SavePIEmail): Promise<Email> {
  Debugger.log("[Data] Adding new Email");
  const email: Email = {
    ...makeNewPersonalDataItemBase(newItem),
    ...makeEmailSpecificProps(newItem),
  };
  return email;
}
export type MakeEmailSpecificResult = Diff<Email, DataModelObject>;
export function makeEmailSpecificProps(
  item: SavePIEmail
): MakeEmailSpecificResult {
  const defaultToEmptyString = defaultTo("");
  return {
    Email: defaultToEmptyString(item.content.email),
    EmailName: defaultToEmptyString(item.content.emailName),
    Type: item.content.type || "PERSO",
  };
}
