import { CarbonDebugConnector } from "@dashlane/communication";
import { LogEntry, LogLevel, redirectConsoleLogs } from "Logs/Debugger";
const redirectConsoleLogLevel =
  (slotName: keyof typeof CarbonDebugConnector) =>
  (eventBus: typeof CarbonDebugConnector, logEntry: LogEntry) => {
    const { message, details = {} } = logEntry;
    eventBus[slotName]({
      date: new Date().toJSON(),
      message,
      optionalParams: Object.keys(details).reduce((acc, key) => {
        return [...acc, details[key]];
      }, []),
    });
  };
const makeRedirectionForLevel = (level: LogLevel) => {
  switch (level) {
    case LogLevel.Error:
      return redirectConsoleLogLevel("error");
    case LogLevel.Warn:
      return redirectConsoleLogLevel("warning");
    case LogLevel.Info:
      return redirectConsoleLogLevel("info");
    case LogLevel.Debug:
    case LogLevel.Verbose:
    default:
      return redirectConsoleLogLevel("log");
  }
};
export function subscribeToDebugEvents(
  eventBus: typeof CarbonDebugConnector
): void {
  redirectConsoleLogs((logEntry: LogEntry) => {
    const { level = LogLevel.Debug } = logEntry;
    const redirection = makeRedirectionForLevel(level);
    redirection(eventBus, logEntry);
  });
}
