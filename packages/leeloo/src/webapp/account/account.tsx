import { Diff } from 'utility-types';
import { PremiumStatus } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { connect, Selector } from 'libs/carbonApiConsumer';
import { remoteDataAdapter } from 'libs/remoteDataAdapter';
import { AccountComponent, AccountComponentProps } from './account-component';
interface InjectedProps {
    premiumStatus: PremiumStatus | null;
}
type WrapperProps = Diff<AccountComponentProps, InjectedProps>;
const premiumStatusSelector: Selector<PremiumStatus | null, WrapperProps, void> = {
    live: carbonConnector.livePremiumStatus,
    query: carbonConnector.getPremiumStatus,
};
const selectors = {
    premiumStatus: premiumStatusSelector,
};
const remoteDataConfig = {
    strategies: selectors,
};
export const Account = connect(remoteDataAdapter<InjectedProps, AccountComponentProps>(AccountComponent, remoteDataConfig), selectors);
