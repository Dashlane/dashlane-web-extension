import { CredentialItemView, CredentialsFirstTokenParams, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { connectPagination, PaginationConfig } from 'libs/pagination/consumer';
import { CredentialsListComponent } from './credentials-component';
const config: PaginationConfig<CredentialsFirstTokenParams, CredentialItemView> = {
    tokenEndpoint: carbonConnector.getCredentialsPaginationToken,
    pageEndpoint: carbonConnector.getCredentialsPage,
    batchLiveEndpoint: carbonConnector.liveCredentialsBatch,
};
export const CredentialsList = connectPagination(config, CredentialsListComponent);
