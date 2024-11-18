import { CommandQueryBus } from "Shared/Infrastructure";
import { config as commandQueryBusConfig } from "Sharing/2/Api/config";
export const bootstrap = (commandQueryBus: CommandQueryBus) => {
  commandQueryBus.register(commandQueryBusConfig);
};
