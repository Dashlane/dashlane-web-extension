import * as queryString from "query-string";
import * as R from "ramda";
import { PlatformInfo } from "@dashlane/communication";
import { post as httpPost, HttpResponse } from "Libs/Http";
import { getPlatformInfo } from "Application/platform-info";
import { HttpRequestResponseTypes } from "Libs/Http/types";
const DASHLANE_DOMAIN = "LmRhc2hsYW5lLmNvbQ==";
const transformer = (data: any) => {
  return queryString.stringify(
    R.map((value) => {
      return Array.isArray(value) ? JSON.stringify(value) : value;
    }, data)
  );
};
const decodeDomain = (encoded: string) => atob(encoded);
const getOrigin = (x?: Window & typeof globalThis) =>
  x ? x?.location?.origin : undefined;
export function getClientAgentHeader(platformInfo: PlatformInfo): string {
  return `version:${platformInfo.appVersion},platform:${platformInfo.platformName}}`;
}
export async function postDataToUrl<T>(
  endpoint: string,
  data: Record<string, any>,
  options?: {
    responseType?: HttpRequestResponseTypes;
    headers?: HeadersInit;
  }
): Promise<HttpResponse<T>> {
  const httpConfig = {
    headers: {
      "Client-Agent": getClientAgentHeader(getPlatformInfo()),
      "Content-Type": "application/x-www-form-urlencoded",
      ...(options?.headers ?? {}),
    },
    transformRequest: [transformer],
    responseType: options?.responseType ?? "json",
  };
  return httpPost<T>(endpoint, data, httpConfig);
}
export const isValidLogin = (login: string) =>
  looksLikeEmail(login) || looksLikeUuid(login);
const SIMPLE_EMAIL_VALIDATION_REGEXP = /^[^\s@]+@([^\s@])+\.([^\s@])+$/i;
export function looksLikeEmail(email: string): boolean {
  return SIMPLE_EMAIL_VALIDATION_REGEXP.test(email);
}
const INVALID_EMAIL_CHARS_REGEXP = /[<>]/g;
export function normalizeEmail(email: string): string {
  return email
    ? email.trim().toLowerCase().replace(INVALID_EMAIL_CHARS_REGEXP, "")
    : "";
}
const SIMPLE_GUID_VALIDATION_REGEXP =
  "^{?[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}}?$";
export function looksLikeUuid(guid: string): boolean {
  return new RegExp(SIMPLE_GUID_VALIDATION_REGEXP).test(guid);
}
export function removeNonDigitCharacters(str: string): string {
  return typeof str === "string" ? str.replace(/\D/g, "") : "";
}
export const checkOrigin = (option?: Window & typeof globalThis) => {
  const value = getOrigin(option);
  return !value || !value.endsWith(decodeDomain(DASHLANE_DOMAIN));
};
