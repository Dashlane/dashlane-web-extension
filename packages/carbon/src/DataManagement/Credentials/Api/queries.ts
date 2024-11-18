import {
  CredentialDataQuery,
  CredentialDetailView,
  CredentialItemView,
  CredentialsByDomainDataQuery,
  CredentialsFirstTokenParams,
  ListResults,
  Page,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type CredentialQueries = {
  getCredential: Query<string, CredentialDetailView>;
  getCredentials: Query<CredentialDataQuery, ListResults<CredentialItemView>>;
  getCredentialsByDomain: Query<
    CredentialsByDomainDataQuery,
    ListResults<CredentialItemView>
  >;
  getCredentialsCount: Query<CredentialDataQuery, number>;
  getCredentialsPage: Query<string, Page<CredentialItemView>>;
  getCredentialsPaginationToken: Query<CredentialsFirstTokenParams, string>;
  getShouldShowRequireMasterPassword: Query<void, boolean>;
};
