import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { CredentialQueries } from "DataManagement/Credentials/Api/queries";
import { CredentialLiveQueries } from "DataManagement/Credentials/Api/live-queries";
import { credentialsCountSelector } from "DataManagement/Credentials/selectors/credentials-count.selector";
import { credentialsPageSelector } from "DataManagement/Credentials/selectors/credentials-page.selector";
import { credentialsPaginationTokenSelector } from "DataManagement/Credentials/selectors/credentials-pagination-token.selector";
import { shouldShowRequireMasterPasswordSelector } from "DataManagement/Credentials/selectors/get-should-show-require-master-password-selector";
import { viewedCredentialCategoriesSelector } from "DataManagement/Credentials/selectors/credential-categories.selector";
import { viewedCredentialSelector } from "DataManagement/Credentials/selectors/viewed-credential.selector";
import { viewedQueriedCredentialsSelector } from "DataManagement/Credentials/selectors/viewed-queried-credentials.selector";
import { viewedQueriedCredentialsByDomainSelector } from "DataManagement/Credentials/selectors/viewed-credentials-by-domain.selector";
import {
  credentials$,
  credentialsBatch$,
  credentialsByDomain$,
  credentialsCount$,
  getCredential$,
} from "DataManagement/Credentials/live";
import { CredentialCommands } from "DataManagement/Credentials/Api/commands";
import { createCredential } from "DataManagement/Credentials/services/createCredential";
import { updateCredentialHandler } from "DataManagement/Credentials/handlers/updateCredentialHandler";
export const config: CommandQueryBusConfig<
  CredentialCommands,
  CredentialQueries,
  CredentialLiveQueries
> = {
  commands: {
    addCredential: {
      handler: createCredential,
    },
    updateCredential: {
      handler: updateCredentialHandler,
    },
  },
  queries: {
    getCredential: { selector: viewedCredentialSelector },
    getCredentialCategories: {
      selector: viewedCredentialCategoriesSelector,
    },
    getCredentials: { selector: viewedQueriedCredentialsSelector },
    getCredentialsByDomain: {
      selector: viewedQueriedCredentialsByDomainSelector,
    },
    getCredentialsCount: { selector: credentialsCountSelector },
    getCredentialsPage: { selector: credentialsPageSelector },
    getCredentialsPaginationToken: {
      selector: credentialsPaginationTokenSelector,
    },
    getShouldShowRequireMasterPassword: {
      selector: shouldShowRequireMasterPasswordSelector,
    },
  },
  liveQueries: {
    liveCredential: { operator: getCredential$ },
    liveCredentials: { operator: credentials$ },
    liveCredentialsByDomain: { operator: credentialsByDomain$ },
    liveCredentialsBatch: { operator: credentialsBatch$ },
    liveCredentialsCount: { operator: credentialsCount$ },
  },
};
