import { CommandQueryBus } from "Shared/Infrastructure";
import { config as commandQueryBusConfig } from "DataManagement/Api/config";
export const bootstrap = (commandQueryBus: CommandQueryBus) => {
  commandQueryBus.register(commandQueryBusConfig);
};