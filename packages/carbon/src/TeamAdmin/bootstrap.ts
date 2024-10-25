import { CommandQueryBus } from "Shared/Infrastructure";
import { config as commandQueryBusConfig } from "TeamAdmin/Api/config";
export const bootstrap = (commandQueryBus: CommandQueryBus) => {
  commandQueryBus.register(commandQueryBusConfig);
};
