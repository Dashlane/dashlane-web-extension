import { CommandQueryBus } from "Shared/Infrastructure";
import { config as commandQueryBusConfig } from "Logs/EventLogger/Api/config";
import { CoreServices } from "Services";
export const bootstrap = (
  commandQueryBus: CommandQueryBus,
  services: CoreServices
) => {
  commandQueryBus.register(commandQueryBusConfig);
  services.eventLoggerService.initRepository();
};
