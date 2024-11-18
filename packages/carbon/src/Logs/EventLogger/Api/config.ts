import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { EventLoggerCommands } from "Logs/EventLogger/Api/commands";
import { logEvent, logPageView } from "../services";
export const config: CommandQueryBusConfig<EventLoggerCommands> = {
  commands: {
    logEvent: { handler: logEvent },
    logPageView: { handler: logPageView },
  },
  queries: {},
  liveQueries: {},
};
