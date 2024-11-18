import {
  AuthenticationCode,
  B2CPlanFeature,
  EmailToken,
  ExtraDeviceToken,
  NodeFamilyMembership,
  OTP,
  PlanMinified,
  PlanType,
  SSOToken,
} from "@dashlane/communication";
import { SupportedAuthenticationMethod } from "Libs/DashlaneApi/services/authentication/common-types";
export const localSupportedAuthenticationMethod: SupportedAuthenticationMethod[] =
  ["totp", "duo_push"];
export const remoteSupportedAuthenticationMethod: SupportedAuthenticationMethod[] =
  ["email_token", "totp", "duo_push", "dashlane_authenticator", "u2f"];
export const makeEmailToken = (value: string): EmailToken => ({
  type: "emailToken",
  value,
});
export const extractEmailToken = (token: EmailToken) => token.value;
export const makeOTP = (token: string): OTP => ({ type: "otp", value: token });
export const makeSsoToken = (token: string): SSOToken => ({
  type: "sso",
  value: token,
});
export const extractOTP = (token: OTP) => token.value;
export const makeExtraDeviceToken = (value: string): ExtraDeviceToken => ({
  type: "extraDeviceToken",
  value,
});
export const extractExtraDeviceToken = (token: ExtraDeviceToken) => token.value;
export interface DashlaneAuthenticatorGetAuthTicketSuccess {
  success: true;
  authTicket: string;
}
export interface DashlaneAuthenticatorGetAuthTicketError {
  success: false;
  error: {
    code: AuthenticationCode;
    message?: string;
  };
}
export type DashlaneAuthenticatorGetAuthTicketResult =
  | DashlaneAuthenticatorGetAuthTicketSuccess
  | DashlaneAuthenticatorGetAuthTicketError;
export enum SessionResumingCode {
  INVALID_LOGIN_IN_STORE = "invalid_login_in_store",
}
export enum PersistData {
  PERSIST_DATA_YES = 0,
  PERSIST_DATA_NO = 1,
}
export enum CancelDashlaneAuthenticatorRegistration {
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}
export enum B2CStatusCode {
  Free = "free",
  Subscribed = "subscribed",
  Legacy = "legacy",
}
export interface B2CStatus {
  statusCode: B2CStatusCode;
  isTrial: boolean;
  autoRenewal: boolean;
  planName?: string;
  planType?: PlanType;
  planFeature?: B2CPlanFeature;
  startDateUnix?: number;
  endDateUnix?: number;
  previousPlan?: PlanMinified;
  familyStatus?: NodeFamilyMembership;
  recoveryHash?: string;
}
export interface CapabilityFromApi {
  capability: string;
  enabled: boolean;
  info?: Record<string, any>;
}
export type UnsafeProfile = {
  login: string;
  deviceAccessKey: string | null;
};
export type Profile = {
  login: string;
  deviceAccessKey: string;
};
export type GhostProfile = {
  login: string;
  deviceAccessKey: unknown;
};
