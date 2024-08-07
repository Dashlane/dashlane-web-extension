import { CarbonDebugConnector } from "../../communication/connectors.types";
import { logError, logInfo, logVerbose, logWarn } from "../console/logger";
import {
  CARBON_LOG_NAMESPACE,
  formatLog as formatCarbonLog,
} from "./formatter";
const eventToLogger = {
  error: logError,
  info: logInfo,
  log: logVerbose,
  warning: logWarn,
};
function isEventValid(event: string): event is keyof typeof eventToLogger {
  return ["error", "info", "log", "warning"].some((e) => e === event);
}
export function initDebugLogger(debugConnector: CarbonDebugConnector): void {
  const events = Object.keys(eventToLogger) as (keyof CarbonDebugConnector)[];
  events.forEach((event) => {
    debugConnector[event].on((log) => {
      if (!isEventValid(event)) {
        throw new Error("Invalid debug connector event");
      }
      const logger = eventToLogger[event];
      logger({
        message: formatCarbonLog(log),
        tags: [CARBON_LOG_NAMESPACE],
      });
    });
  });
}
