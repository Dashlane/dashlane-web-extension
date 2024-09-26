import { Diff } from "utility-types";
import { equals, isNil, pick } from "ramda";
import type {
  ApplicationModulesAccess,
  DataModelObject,
  Note,
  SaveNoteFromUI,
  SaveNoteFromUIContent,
} from "@dashlane/communication";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { StoreService } from "Store";
import { sendExceptionLog } from "Logs/Exception";
import {
  makeNewPersonalDataItemBase,
  makeUpdatedPersonalDataItemBase,
  notifySharersOnUpdate,
} from "DataManagement/helpers";
export const sharedFields: (keyof Note)[] = ["Title", "Content"];
export async function makeUpdatedNote(
  updatedItem: SaveNoteFromUI,
  existingItem: Note
): Promise<Note> {
  return {
    ...existingItem,
    ...makeUpdatedPersonalDataItemBase({
      existingItem,
      updatedItem,
      itemUpdateDate: getUnixTimestamp(),
    }),
    ...makeNoteSpecificProps(updatedItem.content, existingItem),
  };
}
export async function makeNewNote(newItem: SaveNoteFromUI): Promise<Note> {
  return {
    ...makeNewPersonalDataItemBase(newItem),
    ...makeNoteSpecificProps(newItem.content),
  };
}
export type MakeNoteSpecificResult = Diff<Note, DataModelObject>;
export function makeNoteSpecificProps(
  item: Partial<SaveNoteFromUIContent>,
  existingItem?: Note
): MakeNoteSpecificResult {
  const creationDate = existingItem
    ? existingItem.CreationDate
    : getUnixTimestamp();
  const noteUpdateDate = !existingItem
    ? creationDate
    : item.content !== existingItem.Content
    ? getUnixTimestamp()
    : existingItem.UpdateDate;
  return {
    Title:
      (!isNil(item.title) ? item.title : existingItem?.Title) ||
      "Untitled note",
    Content: !isNil(item.content)
      ? item.content
      : !isNil(existingItem?.Content)
      ? existingItem?.Content
      : "",
    Category: !isNil(item.category)
      ? item.category
      : !isNil(existingItem?.Category)
      ? existingItem?.Category
      : "noCategory",
    Secured: !isNil(item.secured)
      ? item.secured
      : !isNil(existingItem?.Secured)
      ? existingItem?.Secured
      : false,
    Type: item.type || existingItem?.Type || "GRAY",
    CreationDate: creationDate,
    UpdateDate: noteUpdateDate,
  };
}
export async function notifySharersNoteUpdated(
  storeService: StoreService,
  originalNote: Note,
  newNote: Note,
  applicationAccessModule: ApplicationModulesAccess
): Promise<boolean> {
  const hasUpdatedFields = !equals(
    pick(sharedFields, originalNote),
    pick(sharedFields, newNote)
  );
  if (!hasUpdatedFields) {
    return true;
  }
  try {
    await notifySharersOnUpdate(storeService, newNote, applicationAccessModule);
    return true;
  } catch (error) {
    const message = `[Sharing] - notifySharersNoteUpdated: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    return false;
  }
}
