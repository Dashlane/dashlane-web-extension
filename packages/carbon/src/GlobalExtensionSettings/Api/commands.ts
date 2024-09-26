import {
  ExtensionSettings,
  RequiredExtensionSettings,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type GlobalExtensionSettingsCommands = {
  getGlobalExtensionSettings: Command<void, ExtensionSettings>;
  setGlobalExtensionSettings: Command<
    RequiredExtensionSettings,
    {
      success: boolean;
    }
  >;
};
