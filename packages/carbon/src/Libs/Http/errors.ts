import {
  CarbonError,
  ErrorMessages,
  ErrorType,
  isCarbonError,
  LibErrorAdditionalInfo,
} from "Libs/Error";
export enum HttpErrorCode {
  CLIENT_ERROR,
  SERVER_ERROR,
  STATUS_CODE,
  CONNECTION_ABORTED,
  CONNECTION_TIMED_OUT,
  NETWORK_ERROR,
  NO_RESPONSE,
  SETUP_FAILED,
}
export const HttpErrorMessages: ErrorMessages = {
  [HttpErrorCode.CLIENT_ERROR]: "Http response with client error status",
  [HttpErrorCode.SERVER_ERROR]: "Http response with server error status",
  [HttpErrorCode.STATUS_CODE]: "Http response with non-succesful status",
  [HttpErrorCode.CONNECTION_ABORTED]: "Connection aborted",
  [HttpErrorCode.CONNECTION_TIMED_OUT]: "Connection timed out",
  [HttpErrorCode.NETWORK_ERROR]: "Network error",
  [HttpErrorCode.NO_RESPONSE]: "No response to Http request",
  [HttpErrorCode.SETUP_FAILED]: "Failed to setup Http request",
};
export interface HttpErrorAdditionalInfo extends LibErrorAdditionalInfo {
  response?: Response;
  request?: Request;
}
export const HttpError: ErrorType = {
  codes: HttpErrorCode,
  name: "HttpError",
  messages: HttpErrorMessages,
};
export type HttpError = CarbonError<HttpErrorCode, HttpErrorAdditionalInfo>;
export const isHttpError = (
  error: any,
  code: HttpErrorCode
): error is HttpError =>
  isCarbonError<HttpErrorCode, HttpErrorAdditionalInfo>(error, HttpError, code);
