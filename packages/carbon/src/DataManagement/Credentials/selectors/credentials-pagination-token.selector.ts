import { CredentialsFirstTokenParams } from "@dashlane/communication";
import { State } from "Store";
import {
  getCredentialsFilterToken,
  getCredentialsFirstToken,
  getCredentialsSortToken,
} from "DataManagement/Credentials/pagination";
import { fieldMappersSelector } from "DataManagement/Credentials/selectors/field-mappers.selector";
import { credentialsQuerySelector } from "DataManagement/Credentials/selectors/credentials-query.selector";
import { stringifyToken } from "Libs/Query";
export const credentialsPaginationTokenSelector = (
  state: State,
  params: CredentialsFirstTokenParams
): string => {
  const sortToken = getCredentialsSortToken(params);
  const filterToken = getCredentialsFilterToken(params);
  const mappers = fieldMappersSelector(state);
  const tokens = { sortToken, filterToken };
  const credentials = credentialsQuerySelector(state, tokens);
  const token = getCredentialsFirstToken(mappers, tokens, params, credentials);
  const stringified = stringifyToken(token);
  return stringified;
};
