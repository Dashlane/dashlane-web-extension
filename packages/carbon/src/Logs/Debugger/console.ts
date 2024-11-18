import { pipe } from "ramda";
import { config } from "config-service";
import {
  withDebugLevel,
  withErrorLevel,
  withInfoLevel,
  withVerboseLevel,
  withWarnLevel,
} from "Logs/Debugger/factories";
import { FormatLogMessage, Log, LogEntry, LogLevel } from "Logs/Debugger/types";
import { formatLogEntry, formatLogEntryDetail } from "Logs/Debugger/formatter";
import { assertUnreachable } from "Helpers/assert-unreachable";
import { DEBUGGER_LOG_TAG, LOGS_LOG_TAG } from "Logs/constants";
let redirection: Log<LogEntry> | null = null;
const getConsoleFnForLevel = (level: LogLevel) => {
  switch (level) {
    case LogLevel.Error:
      return console.error;
    case LogLevel.Warn:
      return console.warn;
    case LogLevel.Info:
      return console.info;
    case LogLevel.Verbose:
      return console.log;
    case LogLevel.Debug:
      return console.debug;
    default:
      return assertUnreachable(level);
  }
};
const makeDefaultConsoleLogHandler =
  <L extends LogEntry>(format: FormatLogMessage): Log<L> =>
  (logEntry: L) => {
    const { level = LogLevel.Error } = logEntry;
    const fn = getConsoleFnForLevel(level);
    const formattedLog = format(logEntry);
    fn.call(this, formattedLog);
  };
const makeConsoleLogHandler =
  <L extends LogEntry>(format: FormatLogMessage): Log<L> =>
  (logEntry: LogEntry) => {
    const handler = redirection
      ? redirection
      : makeDefaultConsoleLogHandler(format);
    return handler(logEntry);
  };
const formatter = formatLogEntry(formatLogEntryDetail);
const filterParam =
  <L extends LogEntry, P extends keyof L>(
    paramName: P,
    predicate: (value: L[P]) => boolean
  ) =>
  (log: Log<L>) =>
  (logEntry: L) =>
    predicate(logEntry[paramName]) && log(logEntry);
const filterTag = filterParam("tag", (tag: string | string[] = []) => {
  const filteredTag = config.LOG_TAGS || [];
  const filteredTags =
    typeof filteredTag === "string" ? [filteredTag] : [...filteredTag];
  const tags = typeof tag === "string" ? [tag] : [...tag];
  return filteredTags.length
    ? filteredTags.some((t: string) => tags.includes(t))
    : true;
});
const filterLevel = filterParam("level", (level: LogLevel) => {
  return level >= config.LOG_LEVEL;
});
const logToConsole = pipe(
  makeConsoleLogHandler,
  filterLevel,
  filterTag
)(formatter);
logToConsole({
  message: "~~~ Logs activated ~~~",
  level: LogLevel.Info,
  tag: [LOGS_LOG_TAG, DEBUGGER_LOG_TAG],
});
export const log = logToConsole;
export const logError = withErrorLevel(logToConsole);
export const logWarn = withWarnLevel(logToConsole);
export const logInfo = withInfoLevel(logToConsole);
export const logDebug = withDebugLevel(logToConsole);
export const logVerbose = withVerboseLevel(logToConsole);
export const redirectConsoleLogs = (handler: Log<LogEntry>) => {
  redirection = handler;
  return () => {
    redirection = null;
  };
};
