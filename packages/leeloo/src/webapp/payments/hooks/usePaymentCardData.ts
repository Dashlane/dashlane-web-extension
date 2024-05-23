import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { PaymentCardDetailView } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export const usePaymentCardData = (uuid: string): PaymentCardDetailView | undefined => {
    const paymentCardData = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getPaymentCard,
            queryParam: uuid,
        },
        liveConfig: {
            live: carbonConnector.livePaymentCard,
            liveParam: uuid,
        },
    }, [uuid]);
    return paymentCardData.status === DataStatus.Success
        ? paymentCardData.data
        : undefined;
};
