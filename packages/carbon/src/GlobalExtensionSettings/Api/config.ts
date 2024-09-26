import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { GlobalExtensionSettingsCommands } from "GlobalExtensionSettings/Api/commands";
import {
  getGlobalExtensionSettings,
  setGlobalExtensionSettings,
} from "../handlers/extensionSettingsHandlers";
export const config: CommandQueryBusConfig<GlobalExtensionSettingsCommands> = {
  commands: {
    setGlobalExtensionSettings: { handler: setGlobalExtensionSettings },
    getGlobalExtensionSettings: { handler: getGlobalExtensionSettings },
  },
  queries: {},
  liveQueries: {},
};
