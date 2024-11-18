import {
  LogEventParam,
  LogEventResult,
  LogPageViewParam,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type EventLoggerCommands = {
  logEvent: Command<LogEventParam, LogEventResult>;
  logPageView: Command<LogPageViewParam, LogEventResult>;
};
