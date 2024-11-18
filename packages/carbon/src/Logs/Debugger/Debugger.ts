import { log as logToConsole } from "Logs/Debugger/console";
import { LogEntry, LogLevel } from "Logs/Debugger/types";
type LoggerFunction = (message?: unknown, ...optionalParams: unknown[]) => void;
interface Logger {
  error: LoggerFunction;
  info: LoggerFunction;
  log: LoggerFunction;
  warn: LoggerFunction;
}
const migrateArgsToLogDetails = (args: unknown[]) => {
  return args.reduce((acc: Record<string, unknown>, arg: unknown) => {
    const argKey = Object.keys(acc).length;
    return { ...acc, [argKey]: arg };
  }, {}) as Record<string, unknown>;
};
const migrateToLogEntry = ([firstArg, ...restArgs]: unknown[]): LogEntry => {
  let message = "";
  let args: unknown[] = [];
  if (typeof firstArg === "string") {
    message = firstArg;
  } else {
    args = [firstArg];
  }
  args = [...args, ...restArgs];
  const details = migrateArgsToLogDetails(args);
  return {
    message,
    details,
  };
};
function create() {
  const handleLog =
    (level: LogLevel) =>
    (...args: unknown[]) => {
      const logEntry: LogEntry = { ...migrateToLogEntry(args), level };
      logToConsole(logEntry);
    };
  const log = handleLog(LogLevel.Debug);
  const info = handleLog(LogLevel.Info);
  const warn = handleLog(LogLevel.Warn);
  const error = handleLog(LogLevel.Error);
  return {
    log,
    info,
    warn,
    error,
  };
}
const Debugger = create();
export { Logger, Debugger };
export default Debugger;
