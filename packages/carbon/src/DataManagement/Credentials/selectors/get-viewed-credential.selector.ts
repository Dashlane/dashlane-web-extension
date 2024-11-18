import { createSelector } from "reselect";
import { sharingDataSelector } from "Sharing/2/Services/selectors/sharing-data.selector";
import { limitedSharingItemsSelector } from "Sharing/2/Services/selectors/limited-sharing-items.selector";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { iconsSelector } from "DataManagement/Icons/selectors";
import { userIdSelector } from "Session/selectors";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { spacesSelector } from "DataManagement/Spaces/selectors";
import { viewCredential } from "DataManagement/Credentials";
export const getViewedCredentialSelector = (credentialId: string) => {
  const credentialSelector = createSelector(
    credentialsSelector,
    (credentials) => findDataModelObject(credentialId, credentials)
  );
  return createSelector(
    credentialSelector,
    sharingDataSelector,
    userIdSelector,
    limitedSharingItemsSelector,
    iconsSelector,
    spacesSelector,
    viewCredential
  );
};
