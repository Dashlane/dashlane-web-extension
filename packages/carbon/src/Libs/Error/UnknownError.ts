import { ErrorMessages, ErrorType } from "Libs/Error/types";
export enum UnknownErrorCode {
  UNKNOWN_ERROR,
}
export const UnknownErrorMessages: ErrorMessages = {
  [UnknownErrorCode.UNKNOWN_ERROR]: "Unknown error",
};
export const UnknownError: ErrorType = {
  codes: UnknownErrorCode,
  name: "UnknownError",
  messages: UnknownErrorMessages,
};
