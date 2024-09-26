import {
  ExceptionCriticality,
  ToggleDashlaneRequest,
  UpdateAutofillSettingsRequest,
} from "@dashlane/communication";
import { Trigger } from "@dashlane/hermes";
import { CoreServices } from "Services";
import { sendExceptionLog } from "Logs/Exception";
import { getDebounceSync } from "DataManagement/utils";
import { updatePersonalSettings } from "DataManagement/Settings";
import { sendUserSettingsLog } from "UserSettingsLog/Services/send-user-settings-log";
import { toggleDashlaneOnSiteToPersonalSettingsPartial } from "./../helpers";
export const updateProtectPasswordsSettingHandler = (
  services: CoreServices,
  protectPasswords: boolean
) => {
  try {
    const updatedPersonalSettings = {
      ProtectPasswords: protectPasswords,
    };
    updatePersonalSettings(
      services.storeService,
      services.sessionService,
      updatedPersonalSettings
    );
    sendUserSettingsLog(services);
    return Promise.resolve();
  } catch (error) {
    const message = `updateProtectPasswordsSettingHandler: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({
      error: augmentedError,
      code: ExceptionCriticality.WARNING,
    });
  }
};
export const updateRichIconsSettingHandler = (
  { sessionService, storeService }: CoreServices,
  richIcons: boolean
) => {
  const debounceSync = getDebounceSync(storeService, sessionService);
  try {
    const updatedPersonalSettings = {
      RichIcons: richIcons,
    };
    updatePersonalSettings(
      storeService,
      sessionService,
      updatedPersonalSettings
    );
    debounceSync({ immediateCall: true }, Trigger.SettingsChange);
    return Promise.resolve();
  } catch (error) {
    const message = `updateRichIconsSettingHandler: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({
      error: augmentedError,
      code: ExceptionCriticality.WARNING,
    });
  }
};
export const toggleDashlaneHandler = (
  { sessionService, storeService }: CoreServices,
  options: ToggleDashlaneRequest
): Promise<void> => {
  const debounceSync = getDebounceSync(storeService, sessionService);
  const personalSettings = storeService.getPersonalSettings();
  const personalSettingsPartial = toggleDashlaneOnSiteToPersonalSettingsPartial(
    personalSettings,
    options
  );
  updatePersonalSettings(storeService, sessionService, personalSettingsPartial);
  debounceSync({ immediateCall: true }, Trigger.SettingsChange);
  return;
};
export const updateAutofillSettingsHandler = (
  { sessionService, storeService }: CoreServices,
  options: UpdateAutofillSettingsRequest
): Promise<void> => {
  const debounceSync = getDebounceSync(storeService, sessionService);
  updatePersonalSettings(storeService, sessionService, {
    AutofillSettings: options.AutofillSettings,
  });
  debounceSync({ immediateCall: true }, Trigger.SettingsChange);
  return;
};
