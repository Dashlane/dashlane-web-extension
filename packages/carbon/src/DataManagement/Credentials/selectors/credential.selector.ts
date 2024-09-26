import { CredentialWithCategory } from "@dashlane/communication";
import { State } from "Store";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
export const credentialSelector = (
  state: State,
  credentialId: string
): CredentialWithCategory | undefined => {
  const credentials = credentialsSelector(state);
  return findDataModelObject(credentialId, credentials);
};
