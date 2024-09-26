import { CommandQueryBus } from "Shared/Infrastructure";
import { config as commandQueryBusConfig } from "DarkWebInsights/Api/config";
export const bootstrap = (commandQueryBus: CommandQueryBus) => {
  commandQueryBus.register(commandQueryBusConfig);
};
