import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { logException } from "Logs/Exception/services";
import { ExceptionCommands } from "./commands";
export const config: CommandQueryBusConfig<ExceptionCommands> = {
  commands: {
    logException: { handler: logException },
  },
  liveQueries: {},
  queries: {},
};
