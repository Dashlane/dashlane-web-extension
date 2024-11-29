import { fromUnixTime } from "date-fns";
import { stringify } from "query-string";
import {
  NotificationName,
  Notifications,
  NotificationStatus,
} from "@dashlane/communication";
import {
  GET_ESSENTIALS_URL,
  GET_PREMIUM_URL,
} from "../../app/routes/constants";
import { openDashlaneUrl, TrackingParams } from "../../libs/external-urls";
import { PricingMode } from "../../libs/premium-status.lib";
export const MS_PER_DAY = 1000 * 60 * 60 * 24;
export const THIRTY_DAYS = 30 * MS_PER_DAY;
export const convertDate = (date: number) => fromUnixTime(date);
export const goToCheckoutPage = (
  coupon: string,
  subCode: string,
  tracking: TrackingParams,
  isEssentials?: boolean,
  pricing?: PricingMode
) => {
  const baseUrl = isEssentials ? GET_ESSENTIALS_URL : GET_PREMIUM_URL;
  const queryString = stringify({
    subCode,
    coupon,
    pricing,
  });
  const url = `${baseUrl}?${queryString}`;
  openDashlaneUrl(url, tracking);
};
export const isNotificationUnseen = (
  notificationsStatus: Notifications,
  notificationName: NotificationName
) => notificationsStatus[notificationName] === NotificationStatus.Unseen;
