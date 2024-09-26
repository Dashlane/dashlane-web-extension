import { State } from "Store";
import { Credential, CredentialWithCategory } from "@dashlane/communication";
import { createSelector } from "reselect";
import { unsafeAllCredentialsSelector } from "DataManagement/Credentials/selectors/unsafe-all-credentials.selector";
import {
  dedupedCredentialsSelector,
  hasCredentialsDedupViewSelector,
} from "DataManagement/Credentials/selectors/deduped-credentials.selector";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import {
  CredentialCategoryIdNamesMap,
  credentialCategoryNamesMapSelector,
} from "DataManagement/Credentials/selectors/credential-categories.selector";
const baseCredentialsSelector = (state: State) =>
  hasCredentialsDedupViewSelector(state)
    ? dedupedCredentialsSelector(state)
    : unsafeAllCredentialsSelector(state);
const credentialsWithCategories: (state: State) => CredentialWithCategory[] =
  createSelector(
    [baseCredentialsSelector, credentialCategoryNamesMapSelector],
    (
      credentials: Credential[],
      categoriesMap: CredentialCategoryIdNamesMap
    ) => {
      return credentials.map((c: Credential) => ({
        ...c,
        CategoryName: categoriesMap[c.Category],
      }));
    }
  );
export const credentialsSelector = createSelector(
  credentialsWithCategories,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
