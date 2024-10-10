import { CommandQueryBus } from "Shared/Infrastructure";
import { config as commandQueryBusConfig } from "Authentication/Api/config";
export const bootstrap = (commandQueryBus: CommandQueryBus) => {
  commandQueryBus.register(commandQueryBusConfig);
};
