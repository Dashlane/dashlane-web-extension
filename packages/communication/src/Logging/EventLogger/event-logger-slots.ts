import { slot } from "ts-event-bus";
import type { LogEventParam, LogEventResult, LogPageViewParam } from "./types";
export const eventLoggerCommandsSlots = {
  logEvent: slot<LogEventParam, LogEventResult>(),
  logPageView: slot<LogPageViewParam, LogEventResult>(),
};
