import { Credential, CredentialFilterToken } from "@dashlane/communication";
import { CredentialMappers } from "DataManagement/Credentials/types";
import { filterData } from "Libs/Query";
import { CredentialMatch } from "DataManagement/Credentials/search";
export const countCredentials = (
  mappers: CredentialMappers,
  credentialMatch: CredentialMatch,
  filterToken: CredentialFilterToken,
  credentials: Credential[]
): number => {
  const matching = filterData(
    mappers,
    credentialMatch,
    filterToken,
    credentials
  );
  return matching.length;
};
