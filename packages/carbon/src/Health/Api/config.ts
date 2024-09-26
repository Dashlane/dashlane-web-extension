import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { HealthCommands } from "Health/Api/commands";
import { evaluatePassword } from "Health/Strength/evaluatePasswordStrength";
export const config: CommandQueryBusConfig<HealthCommands> = {
  commands: {
    evaluatePassword: { handler: evaluatePassword },
  },
  queries: {},
  liveQueries: {},
};
