import {
  LoginViaSsoCode,
  LoginViaSsoError,
  LoginViaSsoSuccess,
  SsoMigrationServerMethod,
} from "@dashlane/communication";
import {
  ApiError,
  B2bSsoUserNotFound,
  CompleteLoginWithAuthTicketError,
  DeviceNotFound,
  InvalidAuthTicket,
  InvalidSsoToken,
  PerformSsoVerificationError,
} from "Libs/DashlaneApi";
import { emitServiceProviderUrl } from "Session/live";
import { serviceProviderUrlSelector } from "Session/sso.selectors";
import { State } from "Store";
export const isSupportedTransitionFlow = (
  currentAuths: string,
  expectedAuths: string
): boolean => {
  if (currentAuths === SsoMigrationServerMethod.SSO) {
    return (
      expectedAuths === SsoMigrationServerMethod.SSO ||
      expectedAuths === SsoMigrationServerMethod.MP
    );
  }
  if (currentAuths === SsoMigrationServerMethod.MP) {
    return expectedAuths === SsoMigrationServerMethod.SSO;
  }
  return false;
};
type SsoErrorCode =
  | PerformSsoVerificationError
  | CompleteLoginWithAuthTicketError;
export const formatAPIError = (error: ApiError<SsoErrorCode>) => {
  switch (error.code) {
    case B2bSsoUserNotFound:
    case InvalidSsoToken:
    case DeviceNotFound:
    case InvalidAuthTicket:
      return makeReturnErrorObject(
        LoginViaSsoCode.SSO_VERIFICATION_FAILED,
        error.message
      );
    default:
      return makeReturnErrorObject(
        LoginViaSsoCode.UNKNOWN_ERROR,
        error.message
      );
  }
};
export const makeReturnErrorObject = (
  code: LoginViaSsoCode,
  message?: string
): LoginViaSsoError => {
  return {
    success: false,
    error: { code, message },
  };
};
export const successResponse = (
  code: LoginViaSsoCode = LoginViaSsoCode.SUCCESS
): LoginViaSsoSuccess => ({
  success: true,
  code,
});
export function triggerServiceProviderUrlRedirect(
  state: State,
  login: string
): string {
  const serviceProviderUrl = serviceProviderUrlSelector(state);
  const spRedirectUrl = `${serviceProviderUrl}?username=${login}`;
  emitServiceProviderUrl(spRedirectUrl);
  return spRedirectUrl;
}
