import { createSelector } from "reselect";
import {
  CredentialCategory,
  CredentialCategoryDetailView,
  ListResults,
} from "@dashlane/communication";
import { State } from "Store";
import { listView as credentialCategoriesListView } from "DataManagement/Credentials/views/category";
export const credentialCategoriesSelector = (
  state: State
): CredentialCategory[] => state.userSession.personalData.credentialCategories;
export type CredentialCategoryIdNamesMap = {
  [categoryId: string]: string;
};
export const credentialCategoryNamesMapSelector = createSelector(
  [credentialCategoriesSelector],
  (categories) => {
    return categories.reduce((acc, value) => {
      acc[value.Id] = value.CategoryName;
      return acc;
    }, {});
  }
);
export const viewedCredentialCategoriesSelector = createSelector(
  credentialCategoriesSelector,
  (categories): ListResults<CredentialCategoryDetailView> => ({
    items: credentialCategoriesListView(categories),
    matchingCount: categories.length,
  })
);
