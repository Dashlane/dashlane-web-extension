import { CoreServices } from "Services";
import {
  ApplicationModulesAccess,
  ExtensionSettings,
  RequiredExtensionSettings,
} from "@dashlane/communication";
import { logToggleAnalyticsEvent } from "Logs/EventLogger/services";
import { setGlobalExtensionSettingsState } from "GlobalExtensionSettings/Store/actions";
import { setAllowedToSendExceptionLog } from "Logs/Exception";
const STORAGE_KEY = "consents";
const CONSENT_FIELDS = {
  interactionDataConsent: "interactionData",
  personalDataConsent: "personalData",
};
const DEFAULT_CONSENTS: Record<keyof typeof CONSENT_FIELDS, null> = {
  interactionDataConsent: null,
  personalDataConsent: null,
};
export function setExceptionLogsConsent(
  applicationModules: ApplicationModulesAccess,
  flag: boolean
) {
  const clients = applicationModules.createClients();
  const { enableExceptionLog } = clients.exceptionLogging.commands;
  void enableExceptionLog({ flag });
}
const normalizeUserConsents = (
  strValues: string | null = null
): ExtensionSettings => {
  const values = JSON.parse(strValues);
  if (!values || typeof values !== "object" || Array.isArray(values)) {
    return DEFAULT_CONSENTS;
  }
  const storedKeys = Object.values(CONSENT_FIELDS);
  if (
    storedKeys.every((key) => Object.prototype.hasOwnProperty.call(values, key))
  ) {
    return {
      interactionDataConsent: values[CONSENT_FIELDS.interactionDataConsent],
      personalDataConsent: values[CONSENT_FIELDS.personalDataConsent],
    };
  }
  return DEFAULT_CONSENTS;
};
export const getGlobalExtensionSettings = async (
  services: CoreServices
): Promise<ExtensionSettings> => {
  const storageService = services.storageService.getLocalStorage();
  try {
    const rawConsentValues = await storageService.readItem(STORAGE_KEY);
    return normalizeUserConsents(rawConsentValues);
  } catch {
    console.warn(
      "failed parsing user consent values; proceeding as if they haven't been set."
    );
    return {
      interactionDataConsent: null,
      personalDataConsent: null,
    };
  }
};
export const setGlobalExtensionSettings = async (
  services: CoreServices,
  data: RequiredExtensionSettings
): Promise<{
  success: boolean;
}> => {
  const storageService = services.storageService.getLocalStorage();
  try {
    await storageService.writeItem(
      STORAGE_KEY,
      JSON.stringify({
        [CONSENT_FIELDS.interactionDataConsent]: data.interactionDataConsent,
        [CONSENT_FIELDS.personalDataConsent]: data.personalDataConsent,
      })
    );
    services.storeService.dispatch(setGlobalExtensionSettingsState(data));
    setAllowedToSendExceptionLog(data.interactionDataConsent !== false);
    setExceptionLogsConsent(
      services.applicationModulesAccess,
      data.interactionDataConsent !== false
    );
    logToggleAnalyticsEvent(services);
  } catch {
    return { success: false };
  }
  return { success: true };
};
