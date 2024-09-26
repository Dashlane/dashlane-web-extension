import {
  CredentialDetailView,
  CredentialItemView,
  ListResults,
} from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type CredentialLiveQueries = {
  liveCredential: LiveQuery<string, CredentialDetailView | undefined>;
  liveCredentials: LiveQuery<string, ListResults<CredentialItemView>>;
  liveCredentialsByDomain: LiveQuery<string, ListResults<CredentialItemView>>;
  liveCredentialsBatch: LiveQuery<string, CredentialItemView[]>;
  liveCredentialsCount: LiveQuery<string, number>;
};
