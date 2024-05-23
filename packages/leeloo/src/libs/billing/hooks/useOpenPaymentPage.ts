import React from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { DASHLANE_UPDATE_PAYMENT_DETAILS_B2B, DASHLANE_UPDATE_PAYMENT_DETAILS_B2C, DASHLANE_UPDATE_PAYMENT_DETAILS_DOMAIN, } from 'app/routes/constants';
import { openDashlaneUrl } from 'libs/external-urls';
import { useRequestPaymentUpdateAuthenticationToken } from 'libs/carbon/hooks/useRequestPaymentUpdateAuthenticationToken';
import { Mode } from '../PaymentLoading';
function getPaymentsUrl(b2c: boolean, mode?: Mode) {
    const paymentUrl = b2c
        ? DASHLANE_UPDATE_PAYMENT_DETAILS_B2C
        : DASHLANE_UPDATE_PAYMENT_DETAILS_B2B;
    return mode ? `${paymentUrl}&mode=${mode}` : paymentUrl;
}
export function useOpenPaymentPage(b2c: boolean, setPaymentLoading: React.Dispatch<React.SetStateAction<boolean>>, mode?: Mode) {
    const intervalRef = React.useRef<number>();
    const intervalCounter = React.useRef<number>(0);
    const windowRef = React.useRef<Window | null>(null);
    const paymentUpdateAuthenticationToken = useRequestPaymentUpdateAuthenticationToken();
    const handleMessageForPayments = (event: MessageEvent) => {
        if (event.origin.includes(DASHLANE_UPDATE_PAYMENT_DETAILS_DOMAIN)) {
            window.clearInterval(intervalRef.current);
        }
    };
    React.useEffect(() => {
        window.addEventListener('message', handleMessageForPayments);
        return () => {
            window.removeEventListener('message', handleMessageForPayments);
        };
    }, []);
    React.useEffect(() => {
        if (APP_PACKAGED_IN_EXTENSION) {
            openDashlaneUrl(getPaymentsUrl(b2c, mode), {
                type: 'subscriptionManagement',
                action: 'goToPayments',
            }, {
                newTab: true,
            });
            setPaymentLoading(false);
        }
        else if (paymentUpdateAuthenticationToken.status === DataStatus.Success &&
            paymentUpdateAuthenticationToken.data.success) {
            const paymentData = {
                success: true,
                accessKey: paymentUpdateAuthenticationToken.data.accessKey,
                creationDateUnix: paymentUpdateAuthenticationToken.data.creationDateUnix,
                expirationDateUnix: paymentUpdateAuthenticationToken.data.expirationDateUnix,
                secretKey: paymentUpdateAuthenticationToken.data.secretKey,
                livemode: paymentUpdateAuthenticationToken.data.livemode,
                b2bPaymentTokens: {
                    customerId: paymentUpdateAuthenticationToken.data.b2bPaymentTokens?.customerId,
                    tokenId: paymentUpdateAuthenticationToken.data.b2bPaymentTokens?.tokenId,
                },
                b2cPaymentTokens: {
                    customerId: paymentUpdateAuthenticationToken.data.b2cPaymentTokens?.customerId,
                    tokenId: paymentUpdateAuthenticationToken.data.b2cPaymentTokens?.tokenId,
                },
            };
            windowRef.current = window.open(`${getPaymentsUrl(b2c, mode)}&utm_medium=subscriptionManagement&utm_source=webapp&utm_term=goToPayments`);
            intervalRef.current = window.setInterval(() => {
                windowRef.current?.postMessage(paymentData, DASHLANE_UPDATE_PAYMENT_DETAILS_DOMAIN);
                intervalCounter.current++;
                if (intervalCounter.current >= 10) {
                    window.clearInterval(intervalRef.current);
                }
            }, 3000);
            setPaymentLoading(false);
        }
    }, [paymentUpdateAuthenticationToken]);
}
