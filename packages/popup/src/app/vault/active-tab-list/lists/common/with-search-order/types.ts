import { CredentialSearchOrder } from '@dashlane/communication';
export interface ISearchOrderProps {
    order: CredentialSearchOrder;
    onOrderChangeHandler: (newOrder: CredentialSearchOrder) => void;
}
