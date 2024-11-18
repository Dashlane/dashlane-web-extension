import { assertUnreachable } from "Helpers/assert-unreachable";
import { CarbonError } from "Libs/Error";
import { HttpError, HttpErrorCode } from "Libs/Http/errors";
import { HttpRequestResponseTypes } from "./types";
export enum HttpStatusCode {
  GATEWAY_TIMEOUT = 504,
}
export async function getResponseBody(
  httpResponse: Response,
  responseType: HttpRequestResponseTypes = "json"
): Promise<unknown> {
  switch (responseType) {
    case "json":
      return httpResponse.json();
    case "text":
      return httpResponse.text();
    case "arraybuffer":
      return httpResponse.arrayBuffer();
    default:
      assertUnreachable(responseType);
  }
}
export function setTimeoutAbort(timeInMs = 60000): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeInMs);
  return controller.signal;
}
export class FetchError extends Error {
  public response: Response | undefined = undefined;
  constructor(message: string) {
    super(message);
  }
}
function isFetchError(error: Error): error is FetchError {
  return error instanceof FetchError;
}
export const getCarbonHttpError = (
  error: Error,
  timeoutSignal: AbortSignal
) => {
  let carbonError: HttpError | null = null;
  if (isFetchError(error) && error.response) {
    const { response } = error;
    const { status } = response;
    if (status >= 400 && status < 500) {
      carbonError = new CarbonError(HttpError, HttpErrorCode.CLIENT_ERROR);
    } else if (status >= 500) {
      carbonError = new CarbonError(HttpError, HttpErrorCode.SERVER_ERROR);
    } else {
      carbonError = new CarbonError(HttpError, HttpErrorCode.STATUS_CODE);
    }
    carbonError.addAdditionalInfo({ response });
  } else if (error.name === "AbortError" && timeoutSignal.aborted) {
    carbonError = new CarbonError(
      HttpError,
      HttpErrorCode.CONNECTION_TIMED_OUT
    );
  } else if (error.name === "AbortError") {
    carbonError = new CarbonError(HttpError, HttpErrorCode.CONNECTION_ABORTED);
  } else if (!self?.navigator?.onLine) {
    carbonError = new CarbonError(HttpError, HttpErrorCode.NETWORK_ERROR);
  } else {
    carbonError = new CarbonError(HttpError, HttpErrorCode.SETUP_FAILED);
  }
  carbonError.addAdditionalInfo({ libError: error.message });
  return carbonError;
};
