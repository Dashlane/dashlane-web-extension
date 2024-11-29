import {
  TwoFactorAuthenticationInfoRequestStatus,
  TwoFactorAuthenticationType,
} from "@dashlane/communication";
import { browser } from "@dashlane/browser-utils";
import { isInFirefoxExtension } from "../../../libs/extension";
import { useTwoFactorAuthenticationInfo } from "../../two-factor-authentication/hooks";
import { WebauthnNotAvailableReasons } from "../../types";
export function useIsWebAuthnAvailable(): {
  result: boolean;
  reason?: WebauthnNotAvailableReasons;
} {
  const twoFactorAuthenticationInfo = useTwoFactorAuthenticationInfo();
  let result = false;
  let reason: WebauthnNotAvailableReasons | undefined;
  if (!APP_PACKAGED_IN_EXTENSION) {
    reason = WebauthnNotAvailableReasons.USING_WEBAPP;
  } else if (isInFirefoxExtension(window.location.href) || browser.isSafari()) {
    reason = WebauthnNotAvailableReasons.UNSUPPORTED_BROWSER;
  } else if (
    twoFactorAuthenticationInfo?.status !==
    TwoFactorAuthenticationInfoRequestStatus.READY
  ) {
    reason = WebauthnNotAvailableReasons.DATA_LOADING;
  } else if (
    twoFactorAuthenticationInfo.type === TwoFactorAuthenticationType.SSO
  ) {
    reason = WebauthnNotAvailableReasons.ENABLED_SSO;
  } else if (
    twoFactorAuthenticationInfo.type === TwoFactorAuthenticationType.LOGIN
  ) {
    reason = WebauthnNotAvailableReasons.ENABLED_2FA;
  } else {
    result = true;
  }
  return {
    result,
    reason,
  };
}
