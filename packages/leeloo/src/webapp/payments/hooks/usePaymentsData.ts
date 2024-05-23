import { CarbonEndpointResult, DataStatus, } from '@dashlane/carbon-api-consumers';
import { BankAccountItemView, ListResults, PaymentCardItemView, } from '@dashlane/communication';
import { useData } from 'libs/carbon/hooks/use-item-data';
import { carbonConnector } from 'libs/carbon/connector';
interface PaymentsData {
    paymentCards: ListResults<PaymentCardItemView>;
    bankAccounts: ListResults<BankAccountItemView>;
}
export const usePaymentsData = (spaceId: string | null): CarbonEndpointResult<PaymentsData> => {
    const paymentCardsData = useData(carbonConnector.getPaymentCards, carbonConnector.livePaymentCards, {
        spaceId,
        sort: 'name',
        sortDirection: 'ascend',
    });
    const bankAccountsData = useData(carbonConnector.getBankAccounts, carbonConnector.liveBankAccounts, {
        spaceId,
        sort: 'accountName',
        sortDirection: 'ascend',
    });
    if (paymentCardsData.status === DataStatus.Success &&
        bankAccountsData.status === DataStatus.Success) {
        return {
            status: DataStatus.Success,
            data: {
                bankAccounts: bankAccountsData.data,
                paymentCards: paymentCardsData.data,
            },
        };
    }
    if (paymentCardsData.status === DataStatus.Error) {
        return { status: DataStatus.Error, error: paymentCardsData.error };
    }
    if (bankAccountsData.status === DataStatus.Error) {
        return { status: DataStatus.Error, error: bankAccountsData.error };
    }
    return { status: DataStatus.Loading };
};
