import { NoteCategory } from "@dashlane/communication";
import { saveNoteCategory as actionSaveNoteCategory } from "Session/Store/personalData/actions";
import { logError } from "Logs/Debugger";
import { generateItemUuid } from "Utils/generateItemUuid";
import { StoreService } from "Store/";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
export interface CategoryToSave {
  id?: string;
  name: string;
}
export function getNewNoteCategory(newCategoryName: string): NoteCategory {
  const categoryId = generateItemUuid();
  return {
    kwType: "KWSecureNoteCategory",
    Id: categoryId,
    CategoryName: newCategoryName.trim(),
    LastBackupTime: 0,
  };
}
export function getUpdatedNoteCategory(
  noteCategories: NoteCategory[],
  newCategoryData: CategoryToSave
): NoteCategory {
  const category = findDataModelObject(newCategoryData.id, noteCategories);
  if (!category) {
    throw new Error("UI asks to update an unknown Note Category");
  }
  return { ...category, CategoryName: newCategoryData.name.trim() };
}
function isCategoryNameValid(
  noteCategories: NoteCategory[],
  newName: string
): boolean {
  if (typeof newName !== "string" || newName.trim() === "") {
    return false;
  }
  return !noteCategories.some((cat) => cat.CategoryName === newName);
}
export function saveNoteCategory(
  storeService: StoreService,
  newCategoryData: CategoryToSave
): NoteCategory {
  if (!storeService.isAuthenticated()) {
    logError({
      message: "No session available to save note category",
    });
    return undefined;
  }
  const noteCategories = storeService.getPersonalData().noteCategories;
  if (!isCategoryNameValid(noteCategories, newCategoryData.name)) {
    logError({
      message: "Category name is invalid",
    });
    return undefined;
  }
  const categoryToSave = newCategoryData.id
    ? getUpdatedNoteCategory(noteCategories, newCategoryData)
    : getNewNoteCategory(newCategoryData.name);
  storeService.dispatch(actionSaveNoteCategory(categoryToSave));
  return categoryToSave;
}
