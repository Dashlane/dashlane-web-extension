import { createSelector } from "reselect";
import { Credential } from "@dashlane/communication";
import { viewCredentialsBatch } from "DataManagement/Credentials/pagination";
import { iconsSelector } from "DataManagement/Icons/selectors";
export const listViewSelector = createSelector(
  iconsSelector,
  (icons) => (credentials: Credential[]) =>
    viewCredentialsBatch(credentials, icons)
);
