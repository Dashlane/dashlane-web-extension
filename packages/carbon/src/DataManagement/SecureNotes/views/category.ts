import { defaultTo } from "ramda";
import { NoteCategory, NoteCategoryDetailView } from "@dashlane/communication";
const defaultToEmptyString = defaultTo("");
export const detailView = (
  category: NoteCategory | undefined
): NoteCategoryDetailView => {
  if (!category) {
    return undefined;
  }
  return {
    id: category.Id,
    categoryName: defaultToEmptyString(category.CategoryName),
  };
};
export const listView = (
  categories: NoteCategory[]
): NoteCategoryDetailView[] => categories.map(detailView);
