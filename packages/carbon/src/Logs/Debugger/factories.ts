import { Log, LogEntry, LogLevel } from "Logs/Debugger/types";
const withSetParam =
  <L extends LogEntry, P extends keyof L>(paramName: P, paramValue: L[P]) =>
  (log: Log<L>): Log<L> =>
  (logEntry: L) =>
    log({
      [paramName]: paramValue,
      ...logEntry,
    });
export const withLevel = (level: LogLevel) => withSetParam("level", level);
export const withTag = (tag: string | string[]) => withSetParam("tag", tag);
export const withErrorLevel = withLevel(LogLevel.Error);
export const withWarnLevel = withLevel(LogLevel.Warn);
export const withInfoLevel = withLevel(LogLevel.Info);
export const withDebugLevel = withLevel(LogLevel.Debug);
export const withVerboseLevel = withLevel(LogLevel.Verbose);
