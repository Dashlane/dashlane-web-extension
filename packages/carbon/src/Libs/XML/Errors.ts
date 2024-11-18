import { ErrorMessages, ErrorType } from "Libs/Error/types";
export enum KWXMLErrorCode {
  PARSING_FAILED,
}
export const KWXMLErrorMessages: ErrorMessages = {
  [KWXMLErrorCode.PARSING_FAILED]: "Failed to parse Dashlane XML",
};
export const KWXMLError: ErrorType = {
  codes: KWXMLErrorCode,
  name: "KWXMLError",
  messages: KWXMLErrorMessages,
};
