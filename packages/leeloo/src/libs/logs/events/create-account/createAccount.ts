import {
  AccountCreationStatus,
  UserCreateAccountEvent,
  WebAccountCreation,
} from "@dashlane/hermes";
import { logEvent } from "../../logEvent";
interface UserFunnelCookie {
  downloadId: number;
  firstVisit: number;
  gclid?: string;
  transaction_id?: string;
  lastVisitTimestamp: number;
  last_click_campaign: string;
  last_click_content: string;
  last_click_medium: string;
  last_click_pathname: string;
  last_click_preapp_source: string;
  last_click_referrer: string;
  last_click_source: string;
  last_click_term: string;
  last_click_visitTimestamp: number;
  pathname: string;
  postback: boolean;
  referrer: string;
  trackingId: string;
  utm_campaign: string;
  utm_content: string;
  utm_medium: string;
  utm_source: string;
  utm_term: string;
  utm_visitTimestamp: number;
}
export const logUserWebAccountCreationEvent = (
  cookieData: UserFunnelCookie,
  emailsTipsAndOffersValue: boolean
) => {
  let webAttribution: WebAccountCreation;
  if (Object.keys(cookieData).length === 0) {
    webAttribution = {
      has_cookie: false,
    };
  } else {
    webAttribution = {
      has_cookie: true,
      heap_identity: cookieData.trackingId,
      gclid: cookieData.gclid,
      everflow_transaction_id: cookieData.transaction_id,
    };
  }
  logEvent(
    new UserCreateAccountEvent({
      isMarketingOptIn: emailsTipsAndOffersValue,
      status: AccountCreationStatus.Success,
      webMarketing: webAttribution,
    })
  );
};
