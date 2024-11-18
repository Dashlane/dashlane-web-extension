import { Debugger } from "Logs/Debugger/Debugger";
export default Debugger;
export {
  log,
  logDebug,
  logError,
  logInfo,
  logVerbose,
  logWarn,
  redirectConsoleLogs,
} from "Logs/Debugger/console";
export * from "Logs/Debugger/Debugger";
export { Log, LogEntry, LogLevel, Silent } from "Logs/Debugger/types";
export {
  withDebugLevel,
  withErrorLevel,
  withInfoLevel,
  withLevel,
  withTag,
  withVerboseLevel,
  withWarnLevel,
} from "Logs/Debugger/factories";
