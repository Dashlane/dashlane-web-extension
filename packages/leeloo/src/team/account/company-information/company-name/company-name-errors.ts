import { TranslatorInterface } from "../../../../libs/i18n/types";
export enum ErrorType {
  DUPLICATE,
  SOMETHING_WRONG,
  EMPTY,
  MALFORMED,
}
export const getErrorMessage = (
  translate: TranslatorInterface,
  errorType: ErrorType
) => {
  switch (errorType) {
    case ErrorType.DUPLICATE:
      return translate("team_account_name_already_exists");
    case ErrorType.EMPTY:
      return translate("team_account_name_is_empty");
    case ErrorType.MALFORMED:
      return translate("team_account_name_is_malformed");
    case ErrorType.SOMETHING_WRONG:
      return translate("team_account_name_error_something_wrong");
    default:
      return translate("team_account_name_error_something_wrong");
  }
};
