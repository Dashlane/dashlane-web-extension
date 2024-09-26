import { Slot, slot } from "ts-event-bus";
import { Log } from "Interfaces/Logs";
export interface DebugConnector {
  log: Slot<Log>;
  info: Slot<Log>;
  warning: Slot<Log>;
  error: Slot<Log>;
  [slotName: string]: Slot<any, any>;
}
export const DebugConnector: DebugConnector = {
  log: slot<Log>(),
  info: slot<Log>(),
  warning: slot<Log>(),
  error: slot<Log>(),
};
