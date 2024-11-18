import { Credential } from "@dashlane/communication";
import { State } from "Store";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
export const credentialSelector = (
  state: State,
  credentialId: string
): Credential | undefined => {
  const credentials = credentialsSelector(state);
  return findDataModelObject(credentialId, credentials);
};
