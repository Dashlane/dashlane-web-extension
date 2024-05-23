import { isPast } from 'date-fns';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { BillingInformation } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { useSubscriptionInformation } from 'libs/carbon/hooks/useSubscriptionInformation';
import { getSvgCard } from 'webapp/subscription-management/payment-method/get-svg-card';
import { useCallback, useEffect, useState } from 'react';
export interface Props {
    b2c?: boolean;
    handleCardUpdate?: (isNewCard: boolean) => void;
    pollInterval?: number;
    timeoutAmount?: number;
}
export interface Output {
    loading: boolean;
    hasCreditCardPaymentMethod?: boolean;
    billingInformation?: BillingInformation;
    last4Digits?: string;
    last4DigitsFormatted?: string;
    cardSvg?: JSX.Element | null;
    isExpired: boolean;
    expYear?: number;
    expMonth?: number;
    expFormatted?: string;
    pollUntilCardUpdate: () => void;
}
export interface LastCardState {
    last4DigitsFormatted?: string | null;
    expFormatted?: string | null;
}
const formatCardLast4Digits = (cardLast4Digits: number) => {
    return cardLast4Digits.toLocaleString('en-US', {
        minimumIntegerDigits: 4,
        useGrouping: false,
    });
};
export const useCreditCardPaymentMethodDisplay = ({ b2c, handleCardUpdate, pollInterval = 2000, timeoutAmount = 10 * 60 * 1000, }: Props): Output => {
    const [isPolling, setIsPolling] = useState<boolean>(false);
    const [lastCardState, setLastCardState] = useState<LastCardState>({});
    const subscriptionInformation = useSubscriptionInformation();
    const loading = subscriptionInformation.status !== DataStatus.Success ||
        !subscriptionInformation.data;
    const billingInformation = subscriptionInformation?.status === DataStatus.Success &&
        subscriptionInformation.data
        ? subscriptionInformation.data[b2c ? 'b2cSubscription' : 'b2bSubscription']?.billingInformation
        : undefined;
    const isExpired = billingInformation?.exp_year && billingInformation?.exp_month
        ? isPast(new Date(billingInformation.exp_year, billingInformation.exp_month, 0))
        : false;
    const last4DigitsFormatted = billingInformation?.last4
        ? formatCardLast4Digits(Number(billingInformation.last4))
        : undefined;
    const cardSvg = billingInformation?.type
        ? getSvgCard(billingInformation.type)
        : undefined;
    const expYear = billingInformation?.exp_year;
    const expMonth = billingInformation?.exp_month;
    const expFormatted = expYear && expMonth ? `${expMonth}/${expYear.toString().substring(2)}` : '';
    const [timeoutTimer, setTimeoutTimer] = useState<number>();
    const stopPolling = useCallback(() => {
        if (isPolling) {
            setIsPolling(false);
        }
        if (timeoutTimer) {
            clearTimeout(timeoutTimer);
        }
    }, [isPolling, timeoutTimer]);
    useEffect(() => stopPolling, []);
    useEffect(() => {
        if (isPolling) {
            const id = setInterval(() => {
                carbonConnector.refreshSubscriptionInformation();
            }, pollInterval);
            if (!timeoutTimer) {
                const timeout = window.setTimeout(stopPolling, timeoutAmount);
                setTimeoutTimer(timeout);
            }
            return () => clearInterval(id);
        }
        return undefined;
    }, [pollInterval, isPolling, stopPolling, timeoutAmount, timeoutTimer]);
    useEffect(() => {
        if (isPolling && lastCardState) {
            if (lastCardState.last4DigitsFormatted !== last4DigitsFormatted ||
                lastCardState.expFormatted !== expFormatted) {
                stopPolling();
                if (handleCardUpdate) {
                    const isNewCard = !lastCardState.last4DigitsFormatted;
                    handleCardUpdate(isNewCard);
                }
            }
        }
    }, [
        isPolling,
        last4DigitsFormatted,
        expFormatted,
        lastCardState,
        lastCardState.expFormatted,
        lastCardState.last4DigitsFormatted,
        stopPolling,
        handleCardUpdate,
    ]);
    const pollUntilCardUpdate = () => {
        setIsPolling(true);
        setLastCardState({
            last4DigitsFormatted,
            expFormatted,
        });
    };
    return {
        loading,
        billingInformation,
        hasCreditCardPaymentMethod: billingInformation && !!billingInformation.last4,
        last4Digits: billingInformation?.last4,
        last4DigitsFormatted,
        cardSvg,
        isExpired,
        expYear: billingInformation?.exp_year,
        expMonth: billingInformation?.exp_month,
        expFormatted,
        pollUntilCardUpdate,
    };
};
