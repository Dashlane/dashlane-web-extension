import {
  FetchError,
  getCarbonHttpError,
  getResponseBody,
  setTimeoutAbort,
} from "Libs/Http/helpers";
import { HttpRequestConfig, HttpResponse } from "Libs/Http/types";
export async function httpGetUsingFetch<T>(
  endpoint: string,
  config: HttpRequestConfig = {}
): Promise<HttpResponse<T>> {
  const timeoutSignal = setTimeoutAbort();
  try {
    const initialRequestInit: RequestInit = {
      credentials: "omit",
      signal: timeoutSignal,
    };
    const requestInit: RequestInit = config.headers
      ? { ...initialRequestInit, headers: config.headers }
      : initialRequestInit;
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
    console.error("[background/carbon] Failed to send GET HTTP request", error);
    const carbonError = getCarbonHttpError(error, timeoutSignal);
    throw carbonError;
  }
}
