import { CommandQueryBus } from "Shared/Infrastructure";
import { config as commandQueryBusConfig } from "GlobalExtensionSettings/Api/config";
import { CoreServices } from "Services";
import {
  getGlobalExtensionSettings,
  setExceptionLogsConsent,
} from "./handlers/extensionSettingsHandlers";
import { setAllowedToSendExceptionLog } from "Logs/Exception";
import { setGlobalExtensionSettingsState } from "./Store/actions";
export const bootstrap = (
  commandQueryBus: CommandQueryBus,
  services: CoreServices
) => {
  commandQueryBus.register(commandQueryBusConfig);
  const { storeService, storageService, applicationModulesAccess } = services;
  getGlobalExtensionSettings({
    storeService,
    storageService,
  } as CoreServices).then((extensionSettings) => {
    storeService.dispatch(setGlobalExtensionSettingsState(extensionSettings));
    setExceptionLogsConsent(
      applicationModulesAccess,
      extensionSettings.interactionDataConsent ?? true
    );
    setAllowedToSendExceptionLog(
      extensionSettings.interactionDataConsent ?? true
    );
  });
};
