import {
  FetchError,
  getCarbonHttpError,
  getResponseBody,
  setTimeoutAbort,
} from "Libs/Http/helpers";
import { HttpRequestConfig, HttpResponse } from "Libs/Http/types";
export async function httpPostUsingFetch<T>(
  endpoint: string,
  data: Record<string, any> | string,
  config: HttpRequestConfig = {}
): Promise<HttpResponse<T>> {
  const timeoutSignal = setTimeoutAbort();
  try {
    const headers = config.headers || {};
    const body = getRequestBody(data, headers["Content-Type"]);
    const requestInit: RequestInit = {
      method: "POST",
      headers,
      body,
      credentials: "omit",
      signal: timeoutSignal,
    };
    const response = await fetch(endpoint, requestInit);
    if (
      (config.validateStatus && !config.validateStatus(response.status)) ??
      !response.ok
    ) {
      const error = new FetchError(`HTTP ${response.status} - ${endpoint}`);
      error.response = response;
      throw error;
    }
    const result = await getResponseBody(response, config.responseType);
    return {
      headers: response.headers,
      data: result as T,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    console.error(
      "[background/carbon] Failed to send POST HTTP request",
      error
    );
    const carbonError = getCarbonHttpError(error, timeoutSignal);
    throw carbonError;
  }
}
function prepareUrlSearchParamsData(
  data: string | Record<string, any>
): string | Record<string, string> {
  if (typeof data === "string") {
    return data;
  }
  return Object.keys(data).reduce((acc, key) => {
    const value = data[key];
    if (typeof value === "undefined") {
      return acc;
    }
    if (typeof value === "string") {
      acc[key] = value;
    } else {
      acc[key] = JSON.stringify(value);
    }
    return acc;
  }, {});
}
function getRequestBody(
  data: Record<string, any> | string,
  contentTypeHeader = "application/json"
): URLSearchParams | FormData | string {
  const lowerCasedContentType = contentTypeHeader.trim().toLowerCase();
  if (lowerCasedContentType.startsWith("application/json")) {
    return JSON.stringify(data);
  }
  if (lowerCasedContentType.startsWith("application/x-www-form-urlencoded")) {
    return new URLSearchParams(prepareUrlSearchParamsData(data));
  }
  if (lowerCasedContentType.startsWith("multipart/form-data")) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    return formData;
  }
  if (
    (lowerCasedContentType.startsWith("text/plain") ||
      lowerCasedContentType.startsWith("application/x-jsonlines")) &&
    typeof data === "string"
  ) {
    return data;
  }
  throw new Error("Unsupported Content-Type for HTTP POST");
}
