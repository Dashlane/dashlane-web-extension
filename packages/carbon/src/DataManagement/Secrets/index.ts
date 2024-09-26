import { Diff } from "utility-types";
import { equals, pick } from "ramda";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { StoreService } from "Store";
import { sendExceptionLog } from "Logs/Exception";
import {
  makeNewPersonalDataItemBase,
  makeUpdatedPersonalDataItemBase,
  notifySharersOnUpdate,
} from "DataManagement/helpers";
import {
  ApplicationModulesAccess,
  DataModelObject,
  SaveSecretFromUI,
  SaveSecretFromUIContent,
  Secret,
} from "@dashlane/communication";
export const sharedFields: (keyof Secret)[] = ["Title", "Content"];
export async function makeUpdatedSecret(
  updatedItem: SaveSecretFromUI,
  existingItem: Secret
): Promise<Secret> {
  return {
    ...existingItem,
    ...makeUpdatedPersonalDataItemBase({
      existingItem,
      updatedItem,
      itemUpdateDate: getUnixTimestamp(),
    }),
    ...makeSecretSpecificProps(updatedItem.content),
  };
}
export async function makeNewSecret(
  newItem: SaveSecretFromUI
): Promise<Secret> {
  return {
    ...makeNewPersonalDataItemBase(newItem),
    ...makeSecretSpecificProps(newItem.content),
  };
}
export type MakeSecretSpecificResult = Diff<Secret, DataModelObject>;
export function makeSecretSpecificProps(
  item: Partial<SaveSecretFromUIContent>
): MakeSecretSpecificResult {
  return {
    Title: item.title || "Untitled secret",
    Content: item.content || "",
    Secured: item.secured || false,
  };
}
export async function notifySharersSecretUpdated(
  storeService: StoreService,
  originalSecret: Secret,
  newSecret: Secret,
  applicationAccessModule: ApplicationModulesAccess
) {
  const hasUpdatedFields = !equals(
    pick(sharedFields, originalSecret),
    pick(sharedFields, newSecret)
  );
  if (!hasUpdatedFields) {
    return true;
  }
  try {
    await notifySharersOnUpdate(
      storeService,
      newSecret,
      applicationAccessModule
    );
    return true;
  } catch (error) {
    const message = `[Sharing] - notifySharersSecretUpdated: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
  }
  return false;
}
