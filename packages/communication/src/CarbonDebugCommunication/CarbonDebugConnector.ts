import { slot, Slot } from "ts-event-bus";
import * as e from "./CarbonDebugEvents";
export const CarbonDebugConnector = {
  log: slot<e.CarbonLog>(),
  info: slot<e.CarbonLog>(),
  warning: slot<e.CarbonLog>(),
  error: slot<e.CarbonLog>(),
};
