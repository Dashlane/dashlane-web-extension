import { CommandQueryBus } from "Shared/Infrastructure";
import { config as commandQueryBusConfig } from "Autofill/VaultData/Api/config";
export const bootstrap = (commandQueryBus: CommandQueryBus) => {
  commandQueryBus.register(commandQueryBusConfig);
};
