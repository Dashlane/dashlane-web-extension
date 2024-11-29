import { config as commandQueryBusConfig } from "ABTests/Api/config";
import { CommandQueryBus } from "Shared/Infrastructure";
export const bootstrap = (commandQueryBus: CommandQueryBus) => {
  commandQueryBus.register(commandQueryBusConfig);
};
