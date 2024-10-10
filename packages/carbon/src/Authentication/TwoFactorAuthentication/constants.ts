import { TwoFactorAuthenticationType } from "@dashlane/communication";
export const TwoFactorAuthenticationEnabled = [
  TwoFactorAuthenticationType.DEVICE_REGISTRATION,
  TwoFactorAuthenticationType.LOGIN,
  TwoFactorAuthenticationType.SSO,
];
export const ENFORCE_2FA_POLICY_REFRESH_TIMER_INTERVAL = 1000 * 60 * 60;
