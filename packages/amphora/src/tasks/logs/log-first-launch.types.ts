export interface DashlaneCookie {
  downloadId: number;
  firstVisit: number;
  gclid?: string;
  transaction_id?: string;
  lastVisitTimestamp: number;
  last_click_campaign?: string;
  last_click_content?: string;
  last_click_medium?: string;
  last_click_pathname?: string;
  last_click_preapp_source: string;
  last_click_referrer?: string;
  last_click_source?: string;
  last_click_term?: string;
  last_click_visitTimestamp: number;
  pathname: string;
  postback: boolean;
  referrer?: string;
  trackingId: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_medium?: string;
  utm_source?: string;
  utm_term?: string;
  utm_visitTimestamp: number;
}
