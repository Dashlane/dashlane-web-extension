import { SecureNote } from '@dashlane/vault-contracts';
import { CredentialDetailView } from '@dashlane/communication';
import { Diff } from 'utility-types';
import { carbonConnector } from 'libs/carbon/connector';
import { connect, Selector } from 'libs/carbonApiConsumer';
import { remoteDataAdapter } from 'libs/remoteDataAdapter';
import { CredentialError, Props } from './error-item';
export interface InjectedProps<T> {
    item: T;
}
type WrapperProps<T> = Diff<Props<T>, InjectedProps<T>>;
const queryParam = (props: Props<CredentialDetailView | SecureNote>) => props.itemId;
const liveParam = queryParam;
const credentialSelector: Selector<CredentialDetailView | undefined, WrapperProps<CredentialDetailView>, string> = {
    query: carbonConnector.getCredential,
    queryParam,
    live: carbonConnector.liveCredential,
    liveParam,
};
const credentialSelectors = {
    item: credentialSelector,
};
const credentialRemoteDataConfig = {
    strategies: credentialSelectors,
};
export const CredentialErrorConnected = connect(remoteDataAdapter<InjectedProps<CredentialDetailView>, Props<CredentialDetailView>>(CredentialError, credentialRemoteDataConfig), credentialSelectors);
