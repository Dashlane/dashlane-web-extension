import {
  NotificationName,
  NotificationStatus,
  PremiumStatus,
  PremiumStatusCode,
} from "@dashlane/communication";
import { DataStatus, PaymentFailureNotificationStatus } from "../types";
import { formatUtcToMillisecondsDate, isXDaysBeforeDate } from "../../date";
import { useNotificationsStatusData } from "./useNotificationsStatusData";
import { usePaymentFailureChurningData } from "../paymentChurning/usePaymentFailureChurning";
import { usePremiumStatusData } from "../premiumStatus/usePremiumStatusData";
import {
  isFreeStatus,
  isStrictPremiumStatus,
} from "../../session/premiumStatus";
const getPremiumStatusCode = (
  premiumStatus: PremiumStatus | null
): PremiumStatusCode | undefined => {
  return premiumStatus ? premiumStatus.statusCode : PremiumStatusCode.NEW_USER;
};
const getPremiumEndDate = (
  premiumStatus: PremiumStatus | null
): number | undefined => {
  return premiumStatus ? premiumStatus.endDate : undefined;
};
const getPreviousPremiumEndDate = (
  premiumStatus: PremiumStatus | null
): number | undefined => {
  return premiumStatus?.previousPlan !== false
    ? premiumStatus?.previousPlan?.endDate
    : undefined;
};
const displayChurning = (
  isPaymentFailureChurningDismissedData: boolean,
  notificationsStatus: Record<NotificationName, NotificationStatus>,
  premiumEndDate: number | undefined,
  premiumStatusCode: PremiumStatusCode | undefined
): boolean => {
  if (
    isStrictPremiumStatus(premiumStatusCode) &&
    isXDaysBeforeDate(7, premiumEndDate)
  ) {
    if (
      notificationsStatus.paymentFailureChurning !==
      NotificationStatus.Interacted
    ) {
      return true;
    } else {
      return isPaymentFailureChurningDismissedData;
    }
  }
  return false;
};
const displayChurned = (
  notificationsStatus: Record<NotificationName, NotificationStatus>,
  previousPremiumEndDate: number | undefined,
  premiumStatusCode: PremiumStatusCode | undefined
): boolean => {
  const isAfterEndPremium =
    previousPremiumEndDate !== undefined &&
    Date.now() - formatUtcToMillisecondsDate(previousPremiumEndDate) >= 0;
  return (
    isFreeStatus(premiumStatusCode) &&
    notificationsStatus.paymentFailureChurned !==
      NotificationStatus.Interacted &&
    isAfterEndPremium
  );
};
export function usePaymentFailureNotificationData(): PaymentFailureNotificationStatus {
  const notificationsStatusData = useNotificationsStatusData();
  const premiumStatusData = usePremiumStatusData();
  const isPaymentFailureChurningDismissedData = usePaymentFailureChurningData();
  if (
    notificationsStatusData.status !== DataStatus.Success ||
    premiumStatusData.status !== DataStatus.Success ||
    isPaymentFailureChurningDismissedData.status !== DataStatus.Success
  ) {
    return PaymentFailureNotificationStatus.None;
  }
  if (!premiumStatusData.data.autoRenewalFailed) {
    return PaymentFailureNotificationStatus.None;
  }
  const notificationsStatus = notificationsStatusData.data;
  const premiumStatusCode = getPremiumStatusCode(premiumStatusData.data);
  const premiumEndDate = getPremiumEndDate(premiumStatusData.data);
  const previousPremiumEndDate = getPreviousPremiumEndDate(
    premiumStatusData.data
  );
  const isPaymentFailureChurningDismissed =
    isPaymentFailureChurningDismissedData.data;
  if (
    displayChurning(
      isPaymentFailureChurningDismissed,
      notificationsStatus,
      premiumEndDate,
      premiumStatusCode
    )
  ) {
    return PaymentFailureNotificationStatus.Churning;
  }
  if (
    displayChurned(
      notificationsStatus,
      previousPremiumEndDate,
      premiumStatusCode
    )
  ) {
    return PaymentFailureNotificationStatus.Churned;
  }
  return PaymentFailureNotificationStatus.None;
}
