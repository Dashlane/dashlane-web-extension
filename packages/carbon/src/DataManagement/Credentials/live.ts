import {
  CredentialDetailView,
  CredentialItemView,
  CredentialsByDomainDataQuery,
  ListResults,
} from "@dashlane/communication";
import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { StateOperator } from "Shared/Live";
import { credentialsCountSelector } from "DataManagement/Credentials/selectors/credentials-count.selector";
import { getLiveCredentialsSelector } from "DataManagement/Credentials/selectors/get-live-credentials.selector";
import { getViewedCredentialSelector } from "DataManagement/Credentials/selectors/get-viewed-credential.selector";
import { getViewedCredentialsBatchSelector } from "DataManagement/Credentials/selectors/get-viewed-credentials-batch.selector";
import { getLiveCredentialsByDomainSelector } from "DataManagement/Credentials/selectors/get-live-credentials-by-domain.selector";
import { State } from "Store";
import { parseToken } from "Libs/Query";
import { sameBatch } from "Libs/Pagination/same-batch";
import { getLivePersonalInfo } from "DataManagement/PersonalInfo/live";
export const credentialsBatch$ = (
  stringToken: string
): StateOperator<CredentialItemView[]> => {
  const token = parseToken(stringToken);
  const selector = getViewedCredentialsBatchSelector(token);
  return pipe(map(selector), distinctUntilChanged(sameBatch));
};
export const getCredential$ = (
  id: string
): StateOperator<CredentialDetailView | undefined> => {
  const selector = getViewedCredentialSelector(id);
  return pipe(map(selector), distinctUntilChanged());
};
export const credentialsCount$ = (
  stringFilterToken: string
): StateOperator<number> => {
  const filterToken = parseToken(stringFilterToken);
  const selector = (state: State) =>
    credentialsCountSelector(state, filterToken);
  return pipe(map(selector), distinctUntilChanged());
};
export const credentials$ = getLivePersonalInfo(getLiveCredentialsSelector);
export const credentialsByDomain$ = (
  stringFilterToken: string
): StateOperator<ListResults<CredentialItemView>> => {
  const { domain, ...query }: CredentialsByDomainDataQuery =
    parseToken(stringFilterToken);
  const selector = getLiveCredentialsByDomainSelector(domain)(query);
  return pipe(
    map(selector),
    distinctUntilChanged(
      (r1, r2) =>
        r1.matchingCount === r2.matchingCount && sameBatch(r1.items, r2.items)
    )
  );
};
