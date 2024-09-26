import { slot } from "ts-event-bus";
import { ExtensionSettings, RequiredExtensionSettings } from "./types";
export const globalExtensionSettingsCommandsSlots = {
  setGlobalExtensionSettings: slot<
    RequiredExtensionSettings,
    {
      success: boolean;
    }
  >(),
  getGlobalExtensionSettings: slot<void, ExtensionSettings>(),
};
