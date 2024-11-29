import { useCallback, useEffect, useState } from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { BillingInformation } from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
import { useSubscriptionInformation } from "../../../libs/carbon/hooks/useSubscriptionInformation";
import { getSvgCard } from "../../../webapp/subscription-management/payment-method/get-svg-card";
import {
  formatCardLast4Digits,
  isBillingMethodExpired,
} from "../../helpers/credit-card-information";
export interface Props {
  b2c?: boolean;
  handleCardUpdate?: (updateSuccessful: boolean, isNewCard?: boolean) => void;
  pollInterval?: number;
  timeoutAmount?: number;
}
export interface Output {
  loading: boolean;
  hasCreditCardPaymentMethod: boolean;
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
export const useCreditCardPaymentMethodDisplay = ({
  b2c,
  handleCardUpdate,
  pollInterval = 3000,
  timeoutAmount = 10 * 60 * 1000,
}: Props): Output => {
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [lastCardState, setLastCardState] = useState<LastCardState>({});
  const [timeoutTimer, setTimeoutTimer] = useState<number>();
  const subscriptionInformation = useSubscriptionInformation();
  const loading =
    subscriptionInformation.status !== DataStatus.Success ||
    !subscriptionInformation.data;
  const billingInformation =
    subscriptionInformation?.status === DataStatus.Success &&
    subscriptionInformation.data
      ? subscriptionInformation.data[
          b2c ? "b2cSubscription" : "b2bSubscription"
        ]?.billingInformation
      : undefined;
  const last4DigitsFormatted = billingInformation?.last4
    ? formatCardLast4Digits(Number(billingInformation.last4))
    : undefined;
  const cardSvg = billingInformation?.type
    ? getSvgCard(billingInformation.type)
    : undefined;
  const expYear = billingInformation?.exp_year;
  const expMonth = billingInformation?.exp_month;
  const expFormatted =
    expYear && expMonth ? `${expMonth}/${expYear.toString().substring(2)}` : "";
  const pollUntilCardUpdate = () => {
    setIsPolling(true);
    setLastCardState({
      last4DigitsFormatted,
      expFormatted,
    });
  };
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
  }, [pollInterval, isPolling, stopPolling, timeoutAmount, timeoutTimer]);
  useEffect(() => {
    if (isPolling && lastCardState) {
      const updateSuccessful =
        lastCardState.last4DigitsFormatted !== last4DigitsFormatted ||
        lastCardState.expFormatted !== expFormatted;
      if (updateSuccessful) {
        stopPolling();
        if (handleCardUpdate) {
          const isNewCard = !lastCardState.last4DigitsFormatted;
          handleCardUpdate(updateSuccessful, isNewCard);
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
  return {
    loading,
    billingInformation,
    hasCreditCardPaymentMethod: !!billingInformation?.last4,
    last4Digits: billingInformation?.last4,
    last4DigitsFormatted,
    cardSvg,
    isExpired: isBillingMethodExpired(billingInformation),
    expYear: billingInformation?.exp_year,
    expMonth: billingInformation?.exp_month,
    expFormatted,
    pollUntilCardUpdate,
  };
};
