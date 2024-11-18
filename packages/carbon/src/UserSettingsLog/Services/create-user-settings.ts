import { State } from "Store";
import { UserSettingsContent } from "../types";
import {
  rememberMeFor14DaysOptedInSelector,
  webAuthnAuthenticationOptedInSelector,
} from "Authentication/selectors";
import { personalSettingsSelector } from "Session/selectors";
export const createUserSettingsLogContent = (
  state: State
): UserSettingsContent => {
  const hasAuthenticationWithWebauthn =
    webAuthnAuthenticationOptedInSelector(state);
  const hasAuthenticationWithRememberMe =
    rememberMeFor14DaysOptedInSelector(state);
  const personalSettings = personalSettingsSelector(state);
  const hasCredentialsProtectWithMasterPassword =
    personalSettings.SecuredDataShowPassword;
  const userSettings = {
    hasAuthenticationWithWebauthn: hasAuthenticationWithWebauthn,
    hasCredentialsProtectWithMasterPassword:
      hasCredentialsProtectWithMasterPassword,
    hasAuthenticationWithRememberMe: hasAuthenticationWithRememberMe,
  };
  return userSettings;
};
