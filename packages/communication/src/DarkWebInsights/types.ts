import type { ValuesType } from "@dashlane/framework-types";
export enum DarkWebInsightsApiErrorType {
  GetDarkWebInsightsFailed = "GET_DARK_WEB_INSIGHTS_FAILED",
  GetDarkWebInsightsSummaryFailed = "GET_DARK_WEB_INSIGHTS_SUMMARY_FAILED",
}
export interface GetDarkWebInsightsParam {
  domain: string;
  offset?: number;
  count?: number;
  orderBy?: "DEFAULT" | "UNSEEN" | "TEAM_MEMBERS" | "PUBLISH_DATE";
}
export type GetDarkWebInsightsReportResults =
  | DarkWebInsightsSuccess
  | DarkWebInsightsError;
export enum DarkWebInsightsBreachType {
  Password = "password",
  CreditCard = "creditcard",
  IPAddress = "ip",
  MailingAddress = "address",
  Phone = "phone",
  Email = "email",
  Social = "social",
  GeoLocation = "geolocation",
  UserName = "username",
  PersonalInfo = "personalinfo",
}
export const EmailIncidentViewStatuses = Object.freeze({
  New: "new",
  Viewed: "viewed",
});
export type EmailIncidentViewStatus = ValuesType<
  typeof EmailIncidentViewStatuses
>;
export type Leaks = {
  domain: string;
  types: string[];
  breachDateUnix: number;
};
export interface EmailIncidentInfo {
  email: string;
  breachesCount: number;
  leaks: Leaks[];
  viewStatus: EmailIncidentViewStatus;
}
export type DarkWebInsightsData = {
  leaksCount: number;
  emailsImpactedCount: number;
  emails: EmailIncidentInfo[];
  allImpactedEmails: string[];
};
export interface DarkWebInsightsError {
  success: false;
  error: {
    code: DarkWebInsightsApiErrorType;
    message: string;
  };
}
export interface DarkWebInsightsSuccess {
  success: true;
  data: DarkWebInsightsData;
}
export type DarkWebInsightsSummaryDomainInfo = {
  leaksCount: number;
  emailsImpactedCount: number;
  teamMembersImpactedCount: number;
  lastExposureDate: string;
  newLeaksCount: number;
  newLeaksAffectedEmailCount: number;
};
export type DarkWebInsightsSummary = Record<
  string,
  DarkWebInsightsSummaryDomainInfo
>;
export interface DarkWebInsightsSummarySuccess {
  success: true;
  data: DarkWebInsightsSummary;
}
export type GetDarkWebInsightsSummaryResponse =
  | DarkWebInsightsSummarySuccess
  | DarkWebInsightsError;
