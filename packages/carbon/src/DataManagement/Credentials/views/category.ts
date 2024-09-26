import { defaultTo } from "ramda";
import {
  CredentialCategory,
  CredentialCategoryDetailView,
} from "@dashlane/communication";
const defaultToEmptyString = defaultTo("");
export const detailView = (
  category: CredentialCategory | undefined
): CredentialCategoryDetailView => {
  if (!category) {
    return undefined;
  }
  return {
    id: category.Id,
    categoryName: defaultToEmptyString(category.CategoryName),
  };
};
export const listView = (
  categories: CredentialCategory[]
): CredentialCategoryDetailView[] => categories.map(detailView);
