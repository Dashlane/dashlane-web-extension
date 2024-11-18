import {
  ErrorMessages,
  ErrorType,
  LibErrorAdditionalInfo,
} from "Libs/Error/types";
import { CarbonError } from "Libs/Error";
export enum WSErrorCode {
  THROTTLED,
  REQUEST_FAILED,
}
export const WSErrorMessages: ErrorMessages = {
  [WSErrorCode.THROTTLED]: "THROTTLED",
  [WSErrorCode.REQUEST_FAILED]:
    "WebService responded with error code in payload",
};
export const WSError: ErrorType = {
  codes: WSErrorCode,
  name: "WSError",
  messages: WSErrorMessages,
};
export interface WSErrorAdditionalInfo extends LibErrorAdditionalInfo {
  webService?: string;
  message?: string;
  webServiceSubMessage?: string;
  code?: string;
}
export type WSError = CarbonError<WSErrorCode, WSErrorAdditionalInfo>;
