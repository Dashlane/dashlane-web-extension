import { CommandQueryBus } from "Shared/Infrastructure";
import { AntiPhishingConfig } from "./Api/config";
export const bootstrap = (commandQueryBus: CommandQueryBus) => {
  commandQueryBus.register(AntiPhishingConfig);
};
