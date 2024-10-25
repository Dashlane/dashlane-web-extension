import { CommandQueryBus } from "Shared/Infrastructure";
import { vpnApiConfig } from "./Api/config";
export const vpnApiBootstrap = (commandQueryBus: CommandQueryBus) => {
  commandQueryBus.register(vpnApiConfig);
};
