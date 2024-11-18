import { CommandQueryBus } from "Shared/Infrastructure";
import { config as passwordGeneratorConfig } from "PasswordGenerator/Api/config";
export const bootstrap = (commandQueryBus: CommandQueryBus) => {
  commandQueryBus.register(passwordGeneratorConfig);
};
