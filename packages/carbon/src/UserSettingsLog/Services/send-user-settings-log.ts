import { UserUserSettingsEvent } from "@dashlane/hermes";
import { logEvent } from "Logs/EventLogger/services";
import { CoreServices } from "Services";
import { createUserSettingsLogContent } from "./create-user-settings";
export const sendUserSettingsLog = async (coreService: CoreServices) => {
  const userSettingsContent = createUserSettingsLogContent(
    coreService.storeService.getState()
  );
  await logEvent(coreService, {
    event: new UserUserSettingsEvent({
      hasAuthenticationWithWebauthn:
        userSettingsContent.hasAuthenticationWithWebauthn,
      hasCredentialsProtectWithMasterPassword:
        userSettingsContent.hasCredentialsProtectWithMasterPassword,
      hasAuthenticationWithRememberMe:
        userSettingsContent.hasAuthenticationWithRememberMe,
    }),
  });
};
