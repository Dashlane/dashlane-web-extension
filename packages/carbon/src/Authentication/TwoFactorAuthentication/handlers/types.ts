import { AuthenticationCode } from "@dashlane/communication";
type TwoFactorAuthenticationHandlerSuccess = {
  success: true;
  logoutRequired?: boolean;
};
type TwoFactorAuthenticationHandlerError = {
  success: false;
  error: {
    code: AuthenticationCode | string;
  };
};
export type TwoFactorAuthenticationHandlerResult =
  | TwoFactorAuthenticationHandlerSuccess
  | TwoFactorAuthenticationHandlerError;
