import { State } from "Store";
import { Credential } from "@dashlane/communication";
import { createSelector } from "reselect";
import { unsafeAllCredentialsSelector } from "DataManagement/Credentials/selectors/unsafe-all-credentials.selector";
import {
  dedupedCredentialsSelector,
  hasCredentialsDedupViewSelector,
} from "DataManagement/Credentials/selectors/deduped-credentials.selector";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
const baseCredentialsSelector = (state: State) =>
  hasCredentialsDedupViewSelector(state)
    ? dedupedCredentialsSelector(state)
    : unsafeAllCredentialsSelector(state);
const credentialsList: (state: State) => Credential[] = createSelector(
  [baseCredentialsSelector],
  (credentials: Credential[]) => {
    return credentials;
  }
);
export const credentialsSelector = createSelector(
  credentialsList,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
