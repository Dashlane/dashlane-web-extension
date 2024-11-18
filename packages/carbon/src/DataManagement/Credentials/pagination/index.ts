import { curry } from "ramda";
import {
  Credential,
  CredentialFilterField,
  CredentialFilterToken,
  CredentialItemView,
  CredentialsFirstTokenParams,
  CredentialSortField,
  CredentialSortToken,
  DataQuery,
} from "@dashlane/communication";
import { generateFirstToken, getBatch } from "Libs/Pagination";
import { Token } from "Libs/Pagination/types";
import { CredentialMappers } from "DataManagement/Credentials/types";
import { listView } from "DataManagement/Credentials/views/list";
import { IconDomains } from "Session/Store/Icons";
import { getIcon } from "DataManagement/Icons/get-icons";
export const getCredentialsFilterToken = ({
  filterCriteria,
}: CredentialsFirstTokenParams): CredentialFilterToken => ({
  filterCriteria: filterCriteria || [],
});
export const getCredentialsSortToken = ({
  sortCriteria,
}: CredentialsFirstTokenParams): CredentialSortToken => ({
  uniqField: "id",
  sortCriteria: sortCriteria || [],
});
export const getCredentialsFirstToken = (
  mappers: CredentialMappers,
  tokens: DataQuery<CredentialSortField, CredentialFilterField>,
  params: CredentialsFirstTokenParams,
  sortedCredentials: Credential[]
): Token<CredentialSortField, CredentialFilterField> =>
  generateFirstToken(
    mappers,
    tokens,
    params.initialBatchSize || 30,
    sortedCredentials
  );
export const viewCredentialsBatch = (
  batch: Credential[],
  icons: IconDomains
): CredentialItemView[] => {
  const getIconById = getIcon(icons);
  const view = listView(getIconById, batch);
  return view;
};
export const getCredentialsBatch = curry(
  (
    token: Token<CredentialSortField, CredentialFilterField>,
    credentials: Credential[],
    mappers: CredentialMappers
  ): Credential[] => getBatch(mappers, token, credentials)
);
