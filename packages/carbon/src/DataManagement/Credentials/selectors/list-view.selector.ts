import { createSelector } from "reselect";
import { Credential } from "@dashlane/communication";
import { viewCredentialsBatch } from "DataManagement/Credentials/pagination";
import { credentialCategoriesSelector } from "DataManagement/Credentials/selectors/credential-categories.selector";
import { iconsSelector } from "DataManagement/Icons/selectors";
export const listViewSelector = createSelector(
  credentialCategoriesSelector,
  iconsSelector,
  (categories, icons) => (credentials: Credential[]) =>
    viewCredentialsBatch(credentials, categories, icons)
);
