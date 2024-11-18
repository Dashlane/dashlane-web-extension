import {
  generateAndSavePasswordHandler,
  generatePasswordHandler,
} from "PasswordGenerator/generatePassword";
import { savePasswordGenerationSettingsHandler } from "PasswordGenerator/savePasswordSettings";
import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { PasswordGeneratorCommands } from "PasswordGenerator/Api/commands";
import { PasswordGeneratorQueries } from "PasswordGenerator/Api/queries";
import { passwordGenerationSettingsSelector } from "PasswordGenerator/selectors";
export const config: CommandQueryBusConfig<
  PasswordGeneratorCommands,
  PasswordGeneratorQueries
> = {
  commands: {
    generatePassword: { handler: generatePasswordHandler },
    generateAndSavePassword: { handler: generateAndSavePasswordHandler },
    savePasswordGenerationSettings: {
      handler: savePasswordGenerationSettingsHandler,
    },
  },
  queries: {
    getPasswordGenerationSettings: {
      selector: passwordGenerationSettingsSelector,
    },
  },
  liveQueries: {},
};
