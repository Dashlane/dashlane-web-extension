import { createSelector } from "reselect";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { getCredentialsDisplayTitles } from "DataManagement/Credentials/helper";
export const credentialDisplayTitlesSelector = createSelector(
  credentialsSelector,
  getCredentialsDisplayTitles
);
